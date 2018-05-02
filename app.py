from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/', methods=['GET','POST'])
def login():
    if request.method =='GET':
        return render_template('login.html',)

    if request.method =='POST':
        username = request.values["login"]
        if username in users:
            flash("Username taken!")
            return render_template("login.html")
        session["login"] = username
        return redirect(url_for("message"))


@app.route('/message', methods=['GET'])
def message():
    return render_template('message.html',)

@app.route('/ohno')
def ohno():
    return render_template('ohno.html',)

users = []

@socketio.on('connect')
def connection():
    print("connected")
    emit("get_username", session['login'])
    emit("user_connected", session['login'], broadcast=True)
    users.append(session['login'])
    emit("full_user_list", users)

@socketio.on('new_message')
def send(data):
    emit("all_user_message", (session['login'], data), broadcast=True) #broadcasts a message to all users public chat

@socketio.on('disconnect')
def disconnect():
    print("disconnected")
    emit("user_disconnected", session['login'], broadcast=True)
    users.remove(session['login'])


app.debug = True

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
