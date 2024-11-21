import mysql
import os
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_mysqldb import MySQL, MySQLdb
import MySQLdb.cursors
import hashlib 
from base64 import b64encode

app = Flask(__name__)

# CONFIGURACIÓN DE LA BASE DE DATOS
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'workbothr'
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024

mysql = MySQL(app)

# CREAR CLAVE SECRETA
app.secret_key = 'WorkBot'

def encrypt_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    msg = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        password = encrypt_password(request.form['password'])
        print(f'Contraseña encriptada: {password}')
        
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM usuarios WHERE nom_usuario = %s', (username,))
        account = cursor.fetchone()
        print(f'Consultando usuario: {username}, encontrado: {account}')

        if account and account['contra_usuario'] == password:
            session['loggedin'] = True
            session['id'] = account['id']
            session['nom_usuario'] = account['nom_usuario']
            session['nom_completo'] = account['nom_completo']
            return redirect(url_for('home'))
        else:
            msg = 'Nombre de usuario o contraseña incorrectos!'
            
    return render_template('login.html', msg=msg)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/nomina')
def nomina():
    return render_template('nomina.html', nom_completo=session["nom_completo"])

@app.route('/home')
def home():
    if 'loggedin' in session:
        return render_template('home.html', nom_completo=session["nom_completo"])
    return redirect(url_for('login'))

@app.route('/beneficios')
def beneficios():
    return render_template('beneficios.html', nom_completo=session["nom_completo"])

@app.route('/capacitacion')
def capacitacion():
    return render_template('capacitacion.html', nom_completo=session["nom_completo"])

@app.route('/configuracion_Perfil_Usuario')
def configuracion_Perfil_Usuario():
    return render_template('configuracion_Perfil_Usuario.html', nom_completo=session["nom_completo"])

@app.route('/guardar_empleado', methods=['POST'])
def guardar_empleado():
    if request.method == 'POST':
        # Extrae datos del formulario
        nombre = request.form['nombre']
        genero = request.form['genero']
        telefono = request.form['telefono']
        correo = request.form['correo']
        estado_civil = request.form['estado_civil']
        fecha_nacimiento = request.form['fecha_nacimiento']
        direccion = request.form['direccion']
        cargo = request.form['cargo']
        area = request.form['area']
        fecha_inicio = request.form['fecha_inicio']
        nivel_experiencia = request.form['nivel_experiencia']
        educacion = request.form['educacion']
        habilidades = request.form['habilidades']

        # Extrae archivos y conviértelos en binario
        curriculum = request.files['curriculum'].read()
        titulos_academicos = request.files['titulos_academicos'].read()
        referencias_laborales = request.files['referencias_laborales'].read()
        carta_presentacion = request.files['carta_presentacion'].read()
        documento_identidad = request.files['documento_identidad'].read()
        foto_perfil = request.files['foto_perfil'].read()
        
        


        # Inserta datos en la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute("SET GLOBAL max_allowed_packet=64*1024*1024")
        sql = """
            INSERT INTO empleados 
            (Nombre, Genero, Telefono, Correo, EstadoCivil, FechaNacimiento, Direccion, Cargo, Area, FechaInicio, 
            NivelExperiencia, Educacion, Habilidades, Curriculum, TitulosAcademicos, ReferenciasLaborales, 
            CartaPresentacion, DocumentoIdentidad, FotoPerfil)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
        cursor.execute(sql, (
                nombre, genero, telefono, correo, estado_civil, fecha_nacimiento, direccion,
                cargo, area, fecha_inicio, nivel_experiencia, educacion, habilidades,
                curriculum, titulos_academicos, referencias_laborales, carta_presentacion, documento_identidad, foto_perfil
            ))
        mysql.connection.commit()

        return redirect('/empleados')
    
@app.route('/empleado/<int:EmpleadoID>')
def empleado_perfil(EmpleadoID):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT FotoPerfil FROM empleados WHERE EmpleadoID = %s", (EmpleadoID,))
    empleado = cursor.fetchone()
    if empleado and empleado['FotoPerfil']:
        Perfil = b64encode(empleado['FotoPerfil']).decode('utf-8')
        return render_template('empleados.html', Perfil=Perfil)
    else:
        return "Empleado no encontrado", 404    

@app.route('/empleados')
def empleados():
    with mysql.connection.cursor() as cursor:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT nombre, correo, cargo, area, direccion, FotoPerfil FROM empleados")
        empleados = cursor.fetchall()
    return render_template('empleados.html', empleados=empleados, nom_completo=session["nom_completo"])

@app.route('/creacionEmpleados')
def creacionEmpleados():
    return render_template('creacionEmpleados.html', nom_completo=session["nom_completo"])
    

@app.route('/gestiondetalentos')
def gestiondetalentos():
    return render_template('gestiondetalentos.html', nom_completo=session["nom_completo"])


@app.route('/horario_empleado')
def horario_empleado():
    return render_template('horario_empleado.html', nom_completo=session["nom_completo"])

@app.route('/horarios')
def horarios():
    return render_template('horarios.html', nom_completo=session["nom_completo"])

@app.route('/politica')
def politica():
    return render_template('politica.html', nom_completo=session["nom_completo"])


@app.route('/reclutamiento')
def reclutamiento():
    return render_template('reclutamiento.html', nom_completo=session["nom_completo"])


@app.route('/rendimiento')
def rendimiento():
    return render_template('rendimiento.html', nom_completo=session["nom_completo"])


@app.route('/seguridad')
def seguridad():
    return render_template('seguridad.html', nom_completo=session["nom_completo"])


@app.route('/seleccion_de_personal')
def seleccion_de_personal():
    return render_template('seleccion_de_personal.html', nom_completo=session["nom_completo"])

@app.route('/detalleEmpleado')
def detalleEmpleado():
    return render_template('detalleEmpleado.html', nom_completo=session["nom_completo"])




if __name__ == '__main__':
    app.run(debug=True)
    
    