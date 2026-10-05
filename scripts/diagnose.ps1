Write-Host "=== 1. Checking port 8000 ==="
$netstatOut = netstat -ano | findstr :8000
Write-Host $netstatOut

if ($netstatOut) {
    # Extract PID
    $lines = $netstatOut -split "`r`n"
    $pidStr = ""
    foreach ($line in $lines) {
        if ($line -match 'LISTENING\s+(\d+)') {
            $pidStr = $matches[1]
            break
        }
    }
    
    if ($pidStr) {
        Write-Host "`n=== 2. Checking process ==="
        tasklist /FI "PID eq $pidStr"
    }
}

Write-Host "`n=== 3. curl /docs ==="
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "Status Code:" $response.StatusCode
} catch {
    Write-Host "Error:" $_.Exception.Message
    if ($_.Exception.Response) {
        Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__
    }
}

Write-Host "`n=== 4 & 5. Testing POST /generate/interview-report ==="
try {
    $body = @{
        job_profile = @{}
        resume_data = @{}
        questions = @()
        responses = @()
        session_config = @{}
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/generate/interview-report" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host "Status Code:" $response.StatusCode
    Write-Host "Body:" $response.Content
} catch {
    if ($_.Exception.Response) {
        Write-Host "Status Code:" $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $body = $reader.ReadToEnd()
        Write-Host "Error Body: $body"
    } else {
        Write-Host "Error:" $_.Exception.Message
    }
}