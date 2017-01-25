// Auteur : CHAIGNE Alexandre
// Utilisation de IORedis
// Actuellement il est possible de se connecter avec un utilisateur
// aléatoire parmis les 3 disponibles. Mais il est possible de se retrouver 
// avec deux mêmes User.
// Lancement:
// node redis_chat.js

// Import de Redis
var Redis = require('ioredis');

// Déclaration du Subscriber de Redis
var sub = new Redis();

// Déclaration du Publisher de Redis
var pub = new Redis();

// Déclaration des nom des utilisateurs
var names = ['User1', 'User2', 'User3']
var name = '';

// Entrée: Le message
// Sortie: Le retour
// Récupère le message envoyé par l'utilisateur
function prompt(message, callback) {
    process.stdin.resume();
    if (message && message !== '') {
    	process.stdout.write(message);
    }
    if (callback) {
	    process.stdin.on('data', function (data) {
	        callback(data.toString().trim());
	    });
    }
}

// "Subscribe" au chat avec redis
sub.subscribe('chat', function (err, count) {});
// ecoute des messages
sub.on('message', function (channel, jsonString) {
  	var json = JSON.parse(jsonString);
  	if (json.name === name) {
  		process.stdout.write('Vous : ' + json.text + '\n');
  	}
  	else {
  		process.stdout.write(json.name + ' : ' + json.text + '\n');
  	}
});


// Envoie des messages
// Log avec un des trois user disponibles
name = names[Math.floor(Math.random()*names.length)];
prompt('Vous êtes enregistré en tant que ' + name + '\n', function(key) {
	if (key === '\u0003') {
		process.exit();
	}
	
	// "Publish" dans le chat 
	pub.publish('chat', JSON.stringify({ name: name, text: key }));
});
