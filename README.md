# RateSite

Aprendendo a montar um site com SailsJS. 
Escolhi por criar o projeto RateSite. Esse programa terá dois usuários padrão. Um prestatador de serviço e um cliente.
Exemplo de uso: Chaveiro/Cliente; Médico/Paciente; Possuidor de Carro/Cliente; Manicure/Cliente ....


#### Fase 1 ####
1. Criei um projeto no [Cloud9](https://c9.io/)
2. Criei o projeto 'RateSite' no [Sails](http://sailsjs.org/get-started)
3. Primeiro Commit

#### Fase 2 ####
1. Implementar o Passport básico criado por [Giancarlo Soverini](http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/) - [commit](https://github.com/makah/FirstSailsProject/commit/811912dec01ab3d58142e4dceea6f2601c7e91d1)
2. Criar uma tela que apenas logados podem entrar (com logout) - [commit](https://github.com/makah/FirstSailsProject/commit/9b9776ffe9d5f435647e09589510385f252e3140)
3. Criar uma mensagem de erro para o usuário, informando que ele não está logado - [commit](https://github.com/makah/FirstSailsProject/commit/a0b22f3d9b5415256fa7ee312c23db7a57093548)
    1. Noob: O nome dessa mensagem e flash() - req.flash()
    2. Info: O Chrome volta e meia manda dois POSTs iguais, com isso as vezes mando um flash duplicado. Não consegui impedir de passar na policy a segunda vez.
    3. Info: A maioria dos flash() que criarei no projeto serão no próprio cliente (quando eu usar o AngularJS), não preciso de um modelo muito complexo.
    4. Eu quero fazer um req.flash() e req.redirect('/') na policies/isAuthenticated.js
    5. Eu pensei em usar a proposta de um [serviço 'FlashService' + política 'flash'](http://stackoverflow.com/a/25352340/205034), mas acho que é mais complexo do que eu preciso, i.e. temos que adicionar a policy sempre antes de outras policies que precisam do flash, e principalmente, não podemos fazer um flash e redirect() como era o objectivo.    6. Acabei usando a [ideia](http://stackoverflow.com/a/28621678/205034) do req.flash() simples. Criando um partial EJS para cuidar disso - alterei o EJS da resposta para fazer para um for no req.flash() [mais robusto]
4. Enviar o password encriptado para o servidor.
    1. Vou continua enviando plain text porque usamos HTTPS
    2. [Explicação¹](http://stackoverflow.com/a/4121657)
    3. [Javascript Cryptography](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/)
5. Criar esqueci minha senha
    1. Permitir mandar email. Utilizei o [sails-hook-email](https://github.com/balderdashy/sails-hook-email). Achei fácil e completo. - [commit]()
    2. Criar token com expiration 
6. Criar login pelo Google/Facebook

#### Detalhes de implementação ####
* Para o front/CSS vamos usar [Foundation](http://foundation.zurb.com/)







