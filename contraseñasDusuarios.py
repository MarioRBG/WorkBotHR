import hashlib

def encrypt_password(password):
    # Usar SHA-256 para encriptar la contraseña
    return hashlib.sha256(password.encode()).hexdigest()

# Contraseña que deseas encriptar
password = "123456"

# Generar el hash
hashed_password = encrypt_password(password)

# Mostrar el hash generado
print("Contraseña encriptada:", hashed_password)