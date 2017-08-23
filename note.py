import sqlite3
import view
import new_note_table
import telebot
import config
from telebot import types

bot = telebot.TeleBot(config.token)
LOG = None
PAS = None
NAME = None
TEXT = None
END = 0
AUTH_REG = 0
@bot.message_handler(func=lambda message: message.text == '/start' and END == 0)
def HeaD(message):
    global END, AUTH_REG
    END = 1
    AUTH_REG = 1
    bot.send_message(message.chat.id,"/reg - new user, /auth - login")

@bot.message_handler(func=lambda message: message.text == '/reg' and AUTH_REG == 1)
def Reg_New(message):
    global AUTH_REG
    AUTH_REG = 0
    bot.send_message(message.chat.id,"Login:")
    bot.register_next_step_handler(message, New_Log)

def New_Log(message):
    a = sqlite3.connect('10.db')
    cursor = a.cursor()
    global LOG
    LOG = str(message.text)
    try:
        new_note_table.new_table(cursor, LOG)
        a.commit()
        a.close()
        bot.send_message(message.chat.id,"Password:")
        bot.register_next_step_handler(message, New_Pas)
    except sqlite3.OperationalError:
        bot.send_message(message.chat.id,"Login is not available!")

def New_Pas(message):
    a = sqlite3.connect('10.db')
    cursor = a.cursor()
    global PAS
    PAS = message.text
    cursor.execute("insert into "+ LOG +" values (?, Null, Null, Null)",[PAS])
    a.commit()
    kb = types.ReplyKeyboardMarkup()
    kb.row('No')
    bot.send_message(message.chat.id, 'New note? Input name of note, or No', reply_markup=kb)
    bot.register_next_step_handler(message, New_Exit)
    a.close()

def New_Exit(message):
    if message.text !='No':
        Name_Note(message)
    elif message.text=='No':
        global END
        END = 0

@bot.message_handler(func=lambda message: message.text == '/auth' and AUTH_REG == 1)    
def Auth(message):
    global AUTH_REG
    AUTH_REG = 0
    bot.send_message(message.chat.id,"Login:")
    bot.register_next_step_handler(message, Auth_Log)

def Auth_Log(message):
    global LOG
    LOG = message.text
    bot.send_message(message.chat.id,"Password:")
    bot.register_next_step_handler(message, Auth_Pas)
    
def Auth_Pas(message):
    a = sqlite3.connect('10.db')
    global AUTH_REG
    cursor = a.cursor()
    global PAS
    PAS = message.text
    try:
        query = "SELECT Password FROM "+ LOG +" ORDER BY Number LIMIT 1"
        cursor.execute(query)
        if  PAS == cursor.fetchone()[0]:
            kb = types.ReplyKeyboardMarkup()
            kb.row('new note','exit')
            kb.row('other notes')
            bot.send_message(message.chat.id,"new note or other notes?", reply_markup=kb)
            bot.register_next_step_handler(message, Auth_Done)
        else:
            bot.send_message(message.chat.id,"Wrong password!")
            AUTH_REG = 1
            bot.send_message(message.chat.id,"/reg - new user, /auth - login")
    except sqlite3.OperationalError:
        bot.send_message(message.chat.id,"Wrong login!")
        AUTH_REG = 1
        bot.send_message(message.chat.id,"/reg - new user, /auth - login")
    a.close()

def Auth_Done(message):
    a = sqlite3.connect('10.db')
    cursor = a.cursor()
    check = message.text
    global END
    if check == 'new note':
        kb = types.ReplyKeyboardRemove()
        bot.send_message(message.chat.id,"Name:", reply_markup=kb)
        bot.register_next_step_handler(message, Name_Note)
    elif check == 'other notes':
        view.view(cursor,LOG, message, bot)
        END = 0
        a.commit()
    elif check == 'exit':
        END = 0
        kb = types.ReplyKeyboardRemove()
        bot.send_message(message.chat.id,"End of session", reply_markup=kb)
    a.close()

def Name_Note(message):
    global NAME
    NAME = message.text
    bot.send_message(message.chat.id,"Note:")
    bot.register_next_step_handler(message, Text_Note)

def Text_Note(message):
    a = sqlite3.connect('10.db')
    cursor = a.cursor()
    global TEXT
    TEXT = message.text
    new_note_table.new_note(cursor, LOG, NAME, TEXT)
    kb = types.ReplyKeyboardMarkup()
    kb.row('new note','exit')
    kb.row('other notes')
    bot.send_message(message.chat.id,"new note or other notes?", reply_markup=kb)
    bot.register_next_step_handler(message, Auth_Done)
    a.commit()
    a.close()
   
bot.polling()
