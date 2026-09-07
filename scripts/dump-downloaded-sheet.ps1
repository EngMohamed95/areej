param(
  [string]$WorkbookPath = "Meat_Port_Downloaded.xlsx"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$workbookFullPath = Join-Path $root $WorkbookPath
$extractDir = Join-Path $root ".tmp_inspect_downloaded"

if (Test-Path $extractDir) {
  Remove-Item -LiteralPath $extractDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null
$zipPath = Join-Path $extractDir "workbook.zip"
Copy-Item -LiteralPath $workbookFullPath -Destination $zipPath -Force
Expand-Archive -LiteralPath $zipPath -DestinationPath $extractDir -Force

function Load-Xml($path) {
  $xml = New-Object System.Xml.XmlDocument
  $xml.PreserveWhitespace = $false
  $xml.Load($path)
  return $xml
}

function Get-ColIndex([string]$cellRef) {
  $letters = $cellRef -replace "\d", ""
  $index = 0
  foreach ($char in $letters.ToCharArray()) {
    $index = ($index * 26) + ([int][char]$char - [int][char]'A' + 1)
  }
  return $index
}

function Get-TextValue($cell, $sharedStrings) {
  $valueNode = $cell.SelectSingleNode("*[local-name()='v']")
  if ($null -eq $valueNode) {
    $inlineNode = $cell.SelectSingleNode("*[local-name()='is']")
    if ($null -ne $inlineNode) { return $inlineNode.InnerText.Trim() }
    return $null
  }
  if ($cell.GetAttribute("t") -eq "s") {
    return $sharedStrings[[int]$valueNode.InnerText].Trim()
  }
  return $valueNode.InnerText.Trim()
}

$sharedStrings = @()
$sharedPath = Join-Path $extractDir "xl/sharedStrings.xml"
if (Test-Path $sharedPath) {
  $sharedXml = Load-Xml $sharedPath
  foreach ($item in $sharedXml.DocumentElement.ChildNodes) {
    $sharedStrings += $item.InnerText
  }
}

$workbookXml = Load-Xml (Join-Path $extractDir "xl/workbook.xml")
$relsXml = Load-Xml (Join-Path $extractDir "xl/_rels/workbook.xml.rels")
$rels = @{}
foreach ($rel in $relsXml.DocumentElement.ChildNodes) {
  $rels[$rel.GetAttribute("Id")] = $rel.GetAttribute("Target")
}

$ns = New-Object System.Xml.XmlNamespaceManager($workbookXml.NameTable)
$ns.AddNamespace("d", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
$ns.AddNamespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")

$sheetNodes = $workbookXml.SelectNodes("//d:sheets/d:sheet", $ns)

$output = @()
for ($i = 0; $i -lt $sheetNodes.Count; $i++) {
  $sheet = $sheetNodes[$i]
  $name = $sheet.GetAttribute("name")
  $target = $rels[$sheet.GetAttribute("id", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")]
  $sheetXml = Load-Xml (Join-Path (Join-Path $extractDir "xl") $target)
  $rows = $sheetXml.SelectNodes("//*[local-name()='sheetData']/*[local-name()='row']")
  
  $sheetData = [pscustomobject]@{
    sheetName = $name
    rowCount = $rows.Count
    rows = @()
  }
  
  foreach ($row in $rows) {
    $vals = @{}
    foreach ($cell in $row.SelectNodes("*[local-name()='c']")) {
      $col = Get-ColIndex $cell.GetAttribute("r")
      $vals[$col] = Get-TextValue $cell $sharedStrings
    }
    $nonEmpty = @{}
    foreach ($k in $vals.Keys) {
      if (-not [string]::IsNullOrWhiteSpace($vals[$k])) {
        $nonEmpty[$k] = $vals[$k]
      }
    }
    if ($nonEmpty.Count -gt 0) {
      $sheetData.rows += $nonEmpty
    }
  }
  $output += $sheetData
}

$output | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $root "scripts/downloaded-sheet-dump.json") -Encoding UTF8
Write-Output "Successfully dumped $($output.Count) sheets to scripts/downloaded-sheet-dump.json"
