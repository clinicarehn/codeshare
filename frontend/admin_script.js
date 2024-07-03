$(function() {
    loadCategories();

    $('#categoryForm').on('submit', function(e) {
        e.preventDefault();

        const newCategory = $('#newCategory').val();

        $.ajax({
            url: '../backend/add_category.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: newCategory }),
            success: function(data) {
                // Mostrar notificación de éxito con Toastify
                Toastify({
                    text: data, // Mensaje devuelto por PHP
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
                    stopOnFocus: true
                }).showToast();

                loadCategories();
                $('#categoryForm')[0].reset();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Mostrar notificación de error con Toastify
                Toastify({
                    text: 'Error al agregar la categoría. Por favor, inténtelo nuevamente.',
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'linear-gradient(to right, #e53935, #b71c1c)',
                    stopOnFocus: true
                }).showToast();

                console.error('AJAX Error: ', textStatus, errorThrown);
            }
        });
    });

    $('#codeForm').on('submit', function(e) {
        e.preventDefault();

        const title = $('#codeTitle').val();
        const code = tinymce.get('codeContent').getContent();
        const example = tinymce.get('example').getContent();
        const category_id = $('#categorySelect').val();

        $.ajax({
            url: '../backend/add_code.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ title, code, example, category_id }),
            success: function(data) {
                // Mostrar notificación de éxito con Toastify
                Toastify({
                    text: data,
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
                    stopOnFocus: true
                }).showToast();

                $('#codeForm')[0].reset();
                tinymce.get('codeContent').setContent('');
                tinymce.get('example').setContent('');
                loadCodes();                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Mostrar notificación de error con Toastify
                Toastify({
                    text: 'Error al agregar el código. Por favor, inténtelo nuevamente.',
                    duration: 3000,
                    gravity: 'top',
                    position: 'center',
                    backgroundColor: 'linear-gradient(to right, #e53935, #b71c1c)',
                    stopOnFocus: true
                }).showToast();

                console.error('AJAX Error: ', textStatus, errorThrown);
            }
        });
    });

    // Función para cargar categorías
    function loadCategories() {
        $.ajax({
            url: '../backend/get_categories.php',
            method: 'GET',
            success: function(data) {
                try {
                    const categories = JSON.parse(data);
                    const categorySelect = $('#categorySelect');
                    categorySelect.empty();

                    categories.forEach(category => {
                        categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
                    });
                } catch (e) {
                    console.error('Invalid JSON: ', data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error: ', textStatus, errorThrown);
            }
        });
    }

    // Función para cargar códigos
    function loadCodes() {
        $.ajax({
            url: '../backend/get_codes.php',
            method: 'GET',
            success: function(data) {
                const codes = JSON.parse(data);
                const codeList = $('#codeList');
                codeList.empty();

                codes.forEach(code => {
                    const codeId = `code-${code.id}`;

                    // Definir el lenguaje para Prism.js
                    let language = '';
                    if (code.category_name === 'C#') {
                        language = 'language-csharp';
                    } else if (code.category_name === 'PHP') {
                        language = 'language-php';
                    } else {
                        language = 'language-markup'; // Cambiado a 'language-markup' para HTML básico
                    }

                    codeList.append(`
                        <div id="${codeId}" class="code-item">
                            <h4>${code.title}</h4>
                            <pre><code class="${language}">${code.code}</code></pre>
                            <h5>Ejemplo de Uso:</h5>
                            <div>${code.example}</div>
                            <button class="btn btn-primary btn-sm mt-2 copy-btn" data-code-id="${codeId}">Copiar Código</button>
                        </div>
                    `);
                });

                // Inicializar Prism.js para resaltar sintaxis
                Prism.highlightAll();

                // Agregar evento click para botones de copiar
                $('.copy-btn').click(function() {
                    const codeId = $(this).data('code-id');
                    const codeContent = $(`#${codeId} pre code`).text();

                    // Copiar al portapapeles
                    navigator.clipboard.writeText(codeContent)
                        .then(() => {
                            // Cambiar texto del botón temporalmente
                            const originalText = $(this).text();
                            $(this).text('Código Copiado');
                            setTimeout(() => {
                                $(this).text(originalText);
                            }, 1500); // Restaurar texto original después de 1.5 segundos
                        })
                        .catch(err => {
                            console.error('Error al copiar al portapapeles:', err);
                            alert('Error al intentar copiar el código. Por favor, cópielo manualmente.');
                        });
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error: ', textStatus, errorThrown);
            }
        });
    }

    // Cargar los códigos al inicio
    loadCodes();
});
