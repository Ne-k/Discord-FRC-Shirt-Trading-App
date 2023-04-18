require('@colors/colors')


const array = []

module.exports = async client => {


      console.log(`[ Client ]`.blue + ` Logged in as ${client.user.tag} `.magenta);
     client.user.setActivity(`FRC Shirt Trading`, { type: 'WATCHING' });


};