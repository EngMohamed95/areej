Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-SheetData([string]$filePath) {
    $tempDir = Join-Path $PSScriptRoot ("temp_" + [System.IO.Path]::GetFileNameWithoutExtension($filePath) -replace " ", "_")
    if (Test-Path $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
    
    [System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $filePath).Path, $tempDir)
    
    $sharedStrings = @()
    $sharedPath = Join-Path $tempDir "xl/sharedStrings.xml"
    if (Test-Path $sharedPath) {
        $sharedXml = [xml](Get-Content -LiteralPath $sharedPath -Raw)
        foreach ($si in $sharedXml.sst.si) {
            $sharedStrings += $si.InnerText
        }
    }
    
    $wbXml = [xml](Get-Content -LiteralPath (Join-Path $tempDir "xl/workbook.xml") -Raw)
    $relsXml = [xml](Get-Content -LiteralPath (Join-Path $tempDir "xl/_rels/workbook.xml.rels") -Raw)
    $rels = @{}
    foreach ($rel in $relsXml.Relationships.Relationship) {
        $rels[$rel.Id] = $rel.Target
    }
    
    $data = [ordered]@{}
    foreach ($sheet in $wbXml.workbook.sheets.sheet) {
        $sheetName = $sheet.name
        $target = $rels[$sheet.id]
        $sheetPath = Join-Path (Join-Path $tempDir "xl") $target
        $sheetXml = [xml](Get-Content -LiteralPath $sheetPath -Raw)
        
        $sheetRows = @()
        foreach ($row in $sheetXml.worksheet.sheetData.row) {
            $rowCells = @{}
            foreach ($c in $row.c) {
                $ref = $c.r
                $letters = $ref -replace "\d", ""
                $colIdx = 0
                foreach ($ch in $letters.ToCharArray()) {
                    $colIdx = ($colIdx * 26) + ([int][char]$ch - [int][char]'A' + 1)
                }
                $val = ""
                if ($c.v) {
                    if ($c.t -eq "s") {
                        $val = $sharedStrings[[int]$c.v]
                    } else {
                        $val = $c.v
                    }
                } elseif ($c.is) {
                    $val = $c.is.InnerText
                }
                $rowCells[$colIdx] = $val
            }
            $sheetRows += ,$rowCells
        }
        $data[$sheetName] = $sheetRows
    }
    
    Remove-Item -LiteralPath $tempDir -Recurse -Force
    return $data
}

$oldData = Get-SheetData "Meat Port 2.xlsx"
$newData = Get-SheetData "Meat Port 2_latest.xlsx"

Write-Output "SUMMARY OF SHEETS IN LATEST:"
foreach ($sheetName in $newData.Keys) {
    $rows = $newData[$sheetName]
    Write-Output "--- Sheet: $sheetName (Total Rows: $($rows.Count)) ---"
    for ($i = 0; $i -lt [math]::Min(12, $rows.Count); $i++) {
        $r = $rows[$i]
        $preview = @()
        foreach ($k in ($r.Keys | Sort-Object)) {
            if ($r[$k]) { $preview += "[$k]: $($r[$k])" }
        }
        Write-Output "  Row $($i+1): $($preview -join ' | ')"
    }
}
