import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres:postgres@localhost:54322/postgres")
    cur = conn.cursor()
    cur.execute("SELECT polname, polcmd, qual, with_check FROM pg_policies WHERE tablename = 'interview_questions';")
    rows = cur.fetchall()
    for row in rows:
        print(f"Policy: {row[0]}, Cmd: {row[1]}, Using: {row[2]}, Check: {row[3]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")