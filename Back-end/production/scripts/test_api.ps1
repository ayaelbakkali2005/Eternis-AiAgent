param([string]$action = "list")

$token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc4MzI1MTY1MiwiaWF0IjoxNzgzMjQ5ODUyfQ.Hmi-fi_0bM1IF0avVy6KX80rhZcHlUhwrqh24KiUUJk"

switch ($action) {
    "list" { curl.exe http://127.0.0.1:8000/api/hr/employees -H "Authorization: Bearer $token" }
    "add" { 
        # كود إضافة موظف
    }
    "ai" {
        # كود سؤال الذكاء الاصطناعي
    }
}