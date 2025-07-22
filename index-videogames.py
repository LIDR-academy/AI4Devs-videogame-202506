# NO TOCAR ESTE ARCHIVO
import os

def create_index_html(base_path):
    # El archivo HTML donde se escribirán los enlaces
    index_file_path = os.path.join(base_path, 'index.html')

    # Comenzar a escribir en el archivo
    with open(index_file_path, 'w', encoding='utf-8') as file:
        file.write('<!DOCTYPE html>\n')
        file.write('<html lang="es">\n')
        file.write('<head>\n')
        file.write('    <meta charset="UTF-8">\n')
        file.write('    <title>Índice de Juegos - AI4Devs</title>\n')
        file.write('    <link rel="preconnect" href="https://fonts.googleapis.com">\n')
        file.write('    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n')
        file.write('    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n')
        file.write('    <link rel="stylesheet" href="styles.css">\n')
        file.write('</head>\n')
        file.write('<body>\n')
        file.write('     <div class="container">\n')
        file.write('        <header class="header">\n')
        file.write('            <img src="https://media.swipepages.com/2021/10/601ca1455e69c70018ca2583/lidr-tech.svg" alt="Lidr Tech" class="logo"> \n') 
        file.write('            <h1 class="title">Selecciona tu juego</h1> \n')
        file.write('            <p class="subtitle">Explora nuestra colección de juegos desarrollados por estudiantes de AI4Devs</p> \n')
        file.write('        </header>\n')
        file.write('         <main class="games-grid">\n')
       

        # Obtener y ordenar todas las carpetas por nombre alfabéticamente
        directories = sorted([item for item in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, item))and item != '.git'])

        # Listar todas las carpetas y crear un enlace para cada juego
        for item in directories:
            # Extrae el nombre del juego separándolo de las iniciales del nombre
            game_name = item.split('-')[0]
            file.write(f'            <a href="{item}/index.html" style="text-decoration: none; color: inherit;" >\n')
            file.write(f'           <div class="game-card"> {game_name} </div>\n')
            file.write('           </a>\n')

  
        file.write('    </div>\n')
        file.write('    <footer>\n')
        file.write('        <p>© AI4Devs students</p>\n')
        file.write('    </footer>\n')
        file.write('</body>\n')
        file.write('</html>\n')

# Especifica el directorio base donde se encuentran las carpetas de los juegos
base_path = './'
create_index_html(base_path)
