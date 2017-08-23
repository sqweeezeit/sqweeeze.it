import sqlite3

def new_note(cur, Log, name, note):
    cur.execute("SELECT Number FROM "+ Log +" ORDER BY Number DESC LIMIT 1")
    b = cur.fetchone()[0]
    if b == None:
        b = 0
    query = "insert into "+ Log +" values (Null, ?, ?, ?)"
    cur.execute(query, [b+1, name, note])

def new_table(cur, Log):
    query = '''CREATE TABLE ''' + Log + '''(Password varchar, Number int, Name varchar, Scr varchar)'''
    cur.execute(query)
    
