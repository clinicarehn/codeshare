$(function() {
    loadCodes();

    // Manejar clic en las categorías
    $('#categoryList').on('click', '.list-group-item', function(e) {
        e.preventDefault();
        const categoryId = $(this).data('category');
        $('.codes-container').hide(); // Ocultar todos los contenedores de códigos
        $(`#${categoryId}`).show(); // Mostrar el contenedor de códigos correspondiente
    });

    // Manejar búsqueda por categoría
    $('#btnSearchCategory').on('click', function() {
        const searchTerm = $('#searchCategory').val().toLowerCase();

        $('.list-group-item').each(function() {
            const category = $(this).text().toLowerCase();
            if (category.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Restaurar lista completa al limpiar el campo de búsqueda de categoría
    $('#searchCategory').on('input', function() {
        if ($(this).val().trim() === '') {
            $('.list-group-item').show();
        }
    });

    // Manejar búsqueda por contenido
    $('#btnSearchContent').on('click', function() {
        const searchTerm = $('#searchContent').val().toLowerCase();

        $('.code-item').each(function() {
            const title = $(this).find('h4').text().toLowerCase();

            if (title.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    

    // Restaurar lista completa al limpiar el campo de búsqueda de contenido
    $('#searchContent').on('input', function() {
        if ($(this).val().trim() === '') {
            $('.code-item').show();
        }
    });

    function loadCodes() {
        $.ajax({
            url: '../backend/get_codes.php',
            method: 'GET',
            success: function(data) {
                const codes = JSON.parse(data);
                const categories = {};

                // Agrupar códigos por categorías
                codes.forEach(code => {
                    if (!categories[code.category_name]) {
                        categories[code.category_name] = [];
                    }
                    categories[code.category_name].push(code);
                });

                // Renderizar categorías y códigos
                const categoryList = $('#categoryList');
                const codeList = $('#codeList');
                categoryList.empty();
                codeList.empty();

                Object.keys(categories).forEach(category => {
                    const categoryId = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

                    // Agregar categoría a la lista
                    categoryList.append(`
                        <a href="#" class="list-group-item list-group-item-action" data-category="${categoryId}">${category}</a>
                    `);

                    // Crear contenedor para los códigos de la categoría
                    const codesContainer = $('<div></div>').attr('id', categoryId).addClass('codes-container').hide();

                    // Agregar cada código al contenedor
                    categories[category].forEach(code => {
                        const codeId = `code-${code.id}`;

                        // Definir el lenguaje para resaltado de sintaxis
                        let language = '';
                        if (code.category_name === 'C#') {
                            language = 'csharp';
                        } else if (code.category_name === 'PHP') {
                            language = 'php';
                        } else {
                            language = 'markup'; // Cambiado a 'markup' para HTML básico
                        }

                        codesContainer.append(`
                            <div id="${codeId}" class="code-item">
                                <h4>${code.title}</h4>
                                <pre><code class="language-${language}">${code.code}</code></pre>
                                <h5>Ejemplo de Uso:</h5>
                                <div>${code.example}</div>
                                <button class="btn btn-primary btn-sm mt-2 copy-btn" data-code-id="${codeId}">Copiar Código</button>
                            </div>
                        `);

                    });

                    codeList.append(codesContainer);
                });

                // Mostrar los códigos de la primera categoría por defecto
                if (Object.keys(categories).length > 0) {
                    const firstCategoryId = Object.keys(categories)[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                    $(`#${firstCategoryId}`).show();
                }

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

                // Inicializar resaltado de sintaxis con Prism.js
                Prism.highlightAll();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('AJAX Error: ', textStatus, errorThrown);
            }
        });
    }

    // Scroll suave para los enlaces del navbar
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
});
