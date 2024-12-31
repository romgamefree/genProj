const fs = require('fs');
const path = require('path');

// Read game data from JSON
const { games, categories } = require('./data/games.json');

// Read templates
const gameTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'game.html'), 'utf-8');

// Ensure output directory exists
const outputDir = path.join(__dirname, 'output', 'static-web');
const categoryDir = path.join(outputDir, 'category');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
}

// Function to generate similar games HTML
function generateSimilarGames(currentGame) {
    const similarGames = games
        .filter(game => game.category === currentGame.category && game.id !== currentGame.id)
        .slice(0, 3);

    return similarGames.map(game => `
        <a href="/${game.slug}.html" class="block group">
            <div class="relative rounded-lg overflow-hidden">
                <img src="/api/placeholder/200/120" alt="${game.name}" class="w-full">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <i class="fas fa-play text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></i>
                </div>
            </div>
            <h4 class="mt-2 text-sm font-medium text-gray-300 group-hover:text-white">${game.name}</h4>
        </a>
    `).join('');
}

// Function to generate game HTML for category pages
function generateGameCard(game) {
    return `
        <div class="bg-gray-800 rounded-lg overflow-hidden group">
            <a href="/${game.slug}.html" class="block">
                <div class="relative">
                    <img src="/api/placeholder/300/200" alt="${game.name}" class="w-full">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                        <i class="fas fa-play text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300"></i>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-white group-hover:text-blue-400">${game.name}</h3>
                    <div class="flex items-center space-x-3 mt-2 text-sm text-gray-400">
                        <span><i class="fas fa-gamepad mr-1"></i>${game.category}</span>
                        <span><i class="fas fa-star mr-1"></i>${game.rating}/5</span>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Function to generate game page HTML
function createGamePage(game) {
    let pageContent = gameTemplate;
    
    // Replace all placeholders
    const replacements = {
        '{{game_name}}': game.name,
        '{{iframe_url}}': game.iframe_url,
        '{{category}}': game.category,
        '{{players}}': game.players,
        '{{rating}}': game.rating,
        '{{game_description}}': game.description,
        '{{game_instructions}}': game.instructions,
        '{{ad_code}}': game.ad_code,
        '{{similar_games}}': generateSimilarGames(game)
    };

    // Replace all placeholders in the template
    for (const [placeholder, value] of Object.entries(replacements)) {
        pageContent = pageContent.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return pageContent;
}

// Generate category pages
categories.forEach(category => {
    const categoryGames = games.filter(game => game.category.toLowerCase() === category.name.toLowerCase());
    const gameCards = categoryGames.map(generateGameCard).join('\n');
    
    const categoryContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="Play ${category.name} Games - Free Online Games">
            <title>${category.name} Games - GamePortal</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body class="bg-gray-900 text-gray-100 font-sans">
            <!-- [Previous Sidebar HTML here - same as game template] -->
            
            <div class="md:ml-64">
                <header class="bg-gray-800 border-b border-gray-700">
                    <div class="container mx-auto px-4 py-6">
                        <h1 class="text-3xl font-bold flex items-center">
                            <i class="${category.icon} mr-3"></i>
                            ${category.name} Games
                        </h1>
                        <p class="text-gray-400 mt-2">${category.description}</p>
                    </div>
                </header>

                <main class="container mx-auto px-4 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${gameCards}
                    </div>
                </main>
            </div>
        </body>
        </html>
    `;

    // Write category page
    const categoryPath = path.join(categoryDir, `${category.id}.html`);
    fs.writeFileSync(categoryPath, categoryContent, 'utf-8');
    console.log(`Created category page: ${category.name} at ${categoryPath}`);
});

// Generate individual game pages
games.forEach(game => {
    const htmlContent = createGamePage(game);
    const filePath = path.join(outputDir, `${game.slug}.html`);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    console.log(`Created game page: ${game.name} at ${filePath}`);
});

// Generate index page
const indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Play Free Online Games - GamePortal">
        <title>GamePortal - Play Free Online Games</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    </head>
    <body class="bg-gray-900 text-gray-100 font-sans">
        <!-- [Previous Sidebar HTML here - same as game template] -->
        
        <div class="md:ml-64">
            <header class="bg-gray-800 border-b border-gray-700">
                <div class="container mx-auto px-4 py-6">
                    <h1 class="text-3xl font-bold">Popular Games</h1>
                    <p class="text-gray-400 mt-2">Play the best free online games</p>
                </div>
            </header>

            <main class="container mx-auto px-4 py-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${games.map(generateGameCard).join('\n')}
                </div>
            </main>
        </div>
    </body>
    </html>
`;

// Write index page
const indexPath = path.join(outputDir, 'index.html');
fs.writeFileSync(indexPath, indexContent, 'utf-8');
console.log(`Created index page at ${indexPath}`);

console.log('Static web page generation completed successfully.');