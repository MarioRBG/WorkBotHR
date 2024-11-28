import mysql
import os
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify,send_file,Response
from flask_mysqldb import MySQL, MySQLdb
import MySQLdb.cursors
import hashlib 
from base64 import b64encode
from flask import send_from_directory, abort
import pandas as pd
import tempfile
from datetime import datetime, timedelta
import time


app = Flask(__name__)

# CONFIGURACIÓN DE LA BASE DE DATOS
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'workbothr'
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

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
        
        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute('SELECT * FROM usuarios WHERE nom_usuario = %s', (username,))
            account = cursor.fetchone()
            print(f'Consultando usuario: {username}, encontrado: {account}')

            if account and account['contra_usuario'] == password:
                session['loggedin'] = True
                session['id'] = account['id']  # ID para actualizaciones
                session['nom_usuario'] = account['nom_usuario']
                session['nom_completo'] = account['nom_completo']
                return redirect(url_for('home'))
            else:
                msg = 'Nombre de usuario o contraseña incorrectos!'
        except Exception as e:
            print(f'Error al autenticar usuario: {e}')
            msg = 'Ocurrió un error. Inténtalo de nuevo.'
        finally:
            cursor.close()

    return render_template('login.html', msg=msg)

@app.route('/nomina')
def nomina():
    return render_template('nomina.html', nom_completo=session["nom_completo"])

@app.route('/home')
def home():
    if 'loggedin' in session:
        return render_template('home.html', nom_completo=session["nom_completo"])
    return redirect(url_for('login'))

@app.route('/guardar_cambios', methods=['POST'])
def guardar_cambios():
    if 'loggedin' not in session:
        flash("Debes iniciar sesión para realizar cambios.", "error")
        return redirect(url_for('login'))

    # Obtener datos del formulario
    nom_completo = request.form.get('nom_completo')
    nom_usuario = request.form.get('nom_usuario')
    usuario_id = session['id']  # ID del usuario autenticado

    # Validar datos
    if not nom_completo or not nom_usuario:
        flash("Todos los campos son obligatorios.", "error")
        return redirect(url_for('configuracion_Perfil_Usuario'))

    # Actualizar datos en la base de datos
    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
            UPDATE usuarios 
            SET nom_completo = %s, nom_usuario = %s 
            WHERE id = %s
        """, (nom_completo, nom_usuario, usuario_id))
        mysql.connection.commit()
        session['nom_usuario'] = nom_usuario  # Actualizar también en la sesión
        session['nom_completo'] = nom_completo
        flash("Los cambios se guardaron exitosamente.", "success")
    except Exception as e:
        mysql.connection.rollback()
        flash(f"Error al guardar los cambios: {e}", "error")
    finally:
        cursor.close()

    return redirect(url_for('configuracion_Perfil_Usuario'))

@app.route('/beneficios')
def beneficios():
    return render_template('beneficios.html', nom_completo=session["nom_completo"])


@app.route('/configuracion_Perfil_Usuario')
def configuracion_Perfil_Usuario():
    return render_template('configuracion_Perfil_Usuario.html', nom_completo=session["nom_completo"])

@app.route('/guardar_empleado', methods=['POST'])
def guardar_empleado():
    if request.method == 'POST':
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

        curriculum = request.files['curriculum'].read()
        titulos_academicos = request.files['titulos_academicos'].read()
        referencias_laborales = request.files['referencias_laborales'].read()
        carta_presentacion = request.files['carta_presentacion'].read()
        documento_identidad = request.files['documento_identidad'].read()
        foto_perfil = request.files['foto_perfil'].read()
        

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
    
    
@app.route('/descargar_empleados')
def descargar_empleados():
    try:
        # Conexión y consulta
        cursor = mysql.connection.cursor()
        query = """
        SELECT EmpleadoID, Nombre, Genero, Telefono, EstadoCivil, FechaNacimiento, 
               Direccion, Cargo, Area, FechaInicio, NivelExperiencia, Educacion, Habilidades 
        FROM empleados
        """
        cursor.execute(query)
        data = cursor.fetchall()
        columns = [
            'EmpleadoID', 'Nombre', 'Genero', 'Telefono', 'EstadoCivil',
            'FechaNacimiento', 'Direccion', 'Cargo', 'Area', 'FechaInicio',
            'NivelExperiencia', 'Educacion', 'Habilidades'
        ]

        # Crear un DataFrame
        df = pd.DataFrame(data, columns=columns)

        # Crear un archivo temporal
        temp_file = tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False)
        filepath = temp_file.name
        df.to_excel(filepath, index=False)

        # Cerrar el cursor
        cursor.close()

        # Enviar el archivo como descarga
        return send_file(filepath, as_attachment=True, download_name="empleados.xlsx")

    except Exception as e:
        return f"Error al generar el archivo Excel: {e}", 500
    
@app.route('/detalleEmpleado/<int:empleado_id>', methods=['GET'])
def detalle_empleado(empleado_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM empleados WHERE EmpleadoID = %s", (empleado_id,))
    empleado = cursor.fetchone()
    if empleado:
        return render_template('detalleEmpleado.html', empleado=empleado)
    else:
        return "Empleado no encontrado", 404
    
@app.route('/eliminarEmpleado/<int:empleado_id>', methods=['POST'])
def eliminar_empleado(empleado_id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM empleados WHERE EmpleadoID = %s", (empleado_id,))
    mysql.connection.commit()
    flash("Empleado eliminado exitosamente.")
    return redirect(url_for('empleados'))  

@app.route('/empleados')
def empleados():
    with mysql.connection.cursor() as cursor:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT EmpleadoID, nombre, correo, cargo, area, direccion, FotoPerfil FROM empleados")
        empleados = cursor.fetchall()
    return render_template('empleados.html', empleados=empleados, nom_completo=session["nom_completo"])

@app.route('/creacionEmpleados')
def creacionEmpleados():
    return render_template('creacionEmpleados.html', nom_completo=session["nom_completo"])
    

@app.route('/gestiondetalentos')
def gestiondetalentos():
    return render_template('gestiondetalentos.html', nom_completo=session["nom_completo"])

@app.route('/agregar', methods=['POST'])
def agregar_datos():
    if request.method == 'POST':
        nombre = request.form['nombre']
        cargo = request.form['cargo']
        area = request.form['area']
        fecha_entrevista = request.form['fecha_entrevista']
        telefono = request.form['telefono']
        fecha_registro = datetime.now()

        cursor = mysql.connection.cursor()
        cursor.execute('''
            INSERT INTO entrevistas (nombre, cargo, area, fecha_entrevista, telefono, fecha_registro)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (nombre, cargo, area, fecha_entrevista, telefono, fecha_registro))
        mysql.connection.commit()
        return redirect(url_for('capacitacion'))
    
@app.route('/capacitacion')
def capacitacion():
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM entrevistas')
    datos = cursor.fetchall()

    # Eliminar registros con más de 24 horas
    ahora = datetime.now()
    cursor.execute('DELETE FROM entrevistas WHERE TIMESTAMPDIFF(HOUR, fecha_registro, %s) > 24', (ahora,))
    mysql.connection.commit()

    return render_template('capacitacion.html', datos=datos,nom_completo=session["nom_completo"])

@app.route('/completar/<int:id>', methods=['POST'])
def completar(id):
    cursor = mysql.connection.cursor()
    cursor.execute('DELETE FROM entrevistas WHERE id = %s', (id,))
    mysql.connection.commit()
    flash('Empleado capacitado correctamente', 'success')
    return redirect(url_for('capacitacion'))


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


accepted_files = []

@app.route('/get_accepted_files', methods=['GET'])
def get_accepted_files():
    return jsonify(files=accepted_files)

@app.route('/aceptar', methods=['POST'])
def aceptar_archivo():
    data = request.json
    if data and 'name' in data:
        accepted_files.append(data['name'])
        return jsonify(success=True)
    return jsonify(success=False)


if __name__ == '__main__':
    app.run(debug=True)
    
    