import sqlite3
from telebot import types
import telebot

BOT = None
CUR = None
LOG = None
numb = None

def view(cur, Log, message, bot):
    global BOT, CUR, LOG
    CUR = cur
    LOG = Log
    BOT = bot
    b = []
    c = []
    d = 0
    for row in cur.execute("SELECT Number FROM "+ Log +" ORDER BY Number"):
        d = d+1
    if d != None:
        for i in range(0,d-1):
            query = "SELECT Number FROM "+ Log +" ORDER BY Number"
            cur.execute(query)
            for raw in cur.execute(query):
                b.append(int(cur.fetchall()[i][0]))
            query = "SELECT Name FROM "+ Log +" ORDER BY Number"
            cur.execute(query)

            for raw in cur.execute(query):
                c.append(str(cur.fetchall()[i][0]))
        sos = ''
        for i in range(0,d-1):
            sos = sos + str(b[i]) + '  -  ' + str(c[i]) + '\n'
        kb = types.ReplyKeyboardRemove()
        bot.send_message(message.chat.id, sos, reply_markup=kb)


        bot.send_message(message.chat.id,"Input number of note:")
        bot.register_next_step_handler(message, Text)
    else:
        kb = types.ReplyKeyboardRemove()
        bot.send_message(message.chat.id, 'There is no notes', reply_markup=kb)
        

def Text(message):
    a = sqlite3.connect('10.db')
    CUR = a.cursor()
    global numb
    numb = int(message.text)
    CUR.execute("SELECT Scr FROM "+ LOG +" WHERE Number =?", [numb])
    st = CUR.fetchone()[0]
    BOT.send_message(message.chat.id, st)
    kb = types.ReplyKeyboardMarkup()
    kb.row('D','U')
    BOT.send_message(message.chat.id, "D - delete note, U - update note,  other for end session:", reply_markup=kb)
    BOT.register_next_step_handler(message, DU)
    a.close()

def DU(message):
    a = sqlite3.connect('10.db')
    CUR = a.cursor()
    du = message.text
    if du == 'D':
        CUR.execute("DELETE FROM " + LOG +" WHERE Number = ?", [numb])
        kb = types.ReplyKeyboardRemove()
        BOT.send_message(message.chat.id,"End of session", reply_markup=kb)
    elif du == 'U':
        kb = types.ReplyKeyboardRemove()
        BOT.send_message(message.chat.id, "New note:", reply_markup=kb)
        BOT.register_next_step_handler(message, NOTE)
    else:
        kb = types.ReplyKeyboardRemove()
        BOT.send_message(message.chat.id,"End of session", reply_markup=kb)
    a.commit()
    a.close()

def NOTE(message):
    a = sqlite3.connect('10.db')
    CUR = a.cursor()
    note = message.text
    CUR.execute("UPDATE "+ LOG +" SET Scr = ? WHERE Number = ?",[note,numb])
    a.commit()
    a.close()
    kb = types.ReplyKeyboardRemove()
    BOT.send_message(message.chat.id,"End of session", reply_markup=kb)
