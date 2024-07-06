document.addEventListener('DOMContentLoaded', function () {
    const formularioLogin = document.getElementById('formularioLogin');
    const formularioRegistro = document.getElementById('formularioRegistro');
    const enlaceRegistro = document.getElementById('enlaceRegistro');
    const enlaceLogin = document.getElementById('enlaceLogin');
    const tituloFormulario = document.getElementById('tituloFormulario');

    enlaceRegistro.addEventListener('click', function () {
        formularioLogin.style.display = 'none';
        formularioRegistro.style.display = 'block';
        tituloFormulario.textContent = 'Regístrate';
        resetearFormulario(formularioLogin);
    });

    enlaceLogin.addEventListener('click', function () {
        formularioRegistro.style.display = 'none';
        formularioLogin.style.display = 'block';
        tituloFormulario.textContent = 'Bienvenido';
        resetearFormulario(formularioRegistro);
    });

    function resetearFormulario(formulario) {
        formulario.reset(); // Resetea los campos del formulario
        const campos = formulario.querySelectorAll('.form-control'); // Obtén todos los campos del formulario
        campos.forEach(campo => {
            campo.classList.remove('is-invalid'); // Elimina las clases de validación inválida
        });
        const errores = formulario.querySelectorAll('.invalid-feedback'); // Obtén todos los elementos de error
        errores.forEach(error => {
            error.textContent = ''; // Limpia los mensajes de error
        });
    }

    formularioLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
    
        const errorCorreoLogin = document.getElementById('errorCorreoLogin');
        const errorContrasenaLogin = document.getElementById('errorContrasenaLogin');
        errorCorreoLogin.textContent = '';
        errorContrasenaLogin.textContent = '';
    
        if (!correo.trim() || !contrasena.trim()) {
            mostrarToast('Error', 'Por favor completa todos los campos');
            return;
        }
    
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuario = usuarios.find(usuario => usuario.correo === correo);
    
        if (!usuario) {
            errorCorreoLogin.textContent = 'El correo no está registrado';
            document.getElementById('correo').classList.add('is-invalid');
            mostrarToast('Error', 'El correo no está registrado');
            return;
        } else if (usuario.contrasena !== contrasena) {
            errorContrasenaLogin.textContent = 'Contraseña incorrecta';
            document.getElementById('contrasena').classList.add('is-invalid');
            mostrarToast('Error', 'Contraseña incorrecta');
            return;
        } else {
            window.location.href = "bienvenido.html";
        }
    });
    
    formularioRegistro.addEventListener('submit', function (e) {
        e.preventDefault();
        const nuevoCorreo = document.getElementById('nuevoCorreo').value;
        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
    
        const errorCorreoRegistro = document.getElementById('errorCorreoRegistro');
        const errorContrasenaRegistro = document.getElementById('errorContrasenaRegistro');
        errorCorreoRegistro.textContent = '';
        errorContrasenaRegistro.textContent = '';
    
        if (!nuevoCorreo.trim() || !nuevaContrasena.trim()) {
            mostrarToast('Error', 'Por favor completa todos los campos');
            return;
        }
    
        if (!validarCorreo(nuevoCorreo)) {
            errorCorreoRegistro.textContent = 'Por favor, introduce un correo electrónico válido';
            document.getElementById('nuevoCorreo').classList.add('is-invalid');
            mostrarToast('Error', 'Correo electrónico inválido');
            return;
        } else {
            document.getElementById('nuevoCorreo').classList.remove('is-invalid');
        }
    
        if (!validarContrasena(nuevaContrasena)) {
            errorContrasenaRegistro.textContent = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.';
            document.getElementById('nuevaContrasena').classList.add('is-invalid');
            mostrarToast('Error', 'Contraseña inválida');
            return;
        } else {
            document.getElementById('nuevaContrasena').classList.remove('is-invalid');
        }
    
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExiste = usuarios.some(usuario => usuario.correo === nuevoCorreo);
    
        if (usuarioExiste) {
            errorCorreoRegistro.textContent = 'El correo ya está registrado';
            document.getElementById('nuevoCorreo').classList.add('is-invalid');
            mostrarToast('Error', 'El correo ya está registrado');
        } else {
            const usuario = {
                correo: nuevoCorreo,
                contrasena: nuevaContrasena
            };
            usuarios.push(usuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            formularioRegistro.style.display = 'none';
            formularioLogin.style.display = 'block';
            tituloFormulario.textContent = 'Bienvenido';
            mostrarToast('Éxito', 'Usuario registrado correctamente');
        }
    });
    
    function mostrarToast(tipo, mensaje) {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.classList.add(`bg-${tipo.toLowerCase()}`);
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${tipo}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${mensaje}
            </div>
        `;
        toastContainer.appendChild(toast);
        const bootstrapToast = new bootstrap.Toast(toast);
        bootstrapToast.show();
    }

    function validarCorreo(correo) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(correo).toLowerCase());
    }

    function validarContrasena(contrasena) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(String(contrasena));
    }
});
