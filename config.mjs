import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

// 1. On enregistre tout. Cela crée des transforms nommées "ts/size/px", etc.
register(StyleDictionary);

async function run() {
  try {
    const rawData = JSON.parse(fs.readFileSync('./tokens.json', 'utf8'));
    const flatTokens = { ...rawData["Primitives"], ...rawData["Tokens"] };
    fs.writeFileSync('./tokens-flat.json', JSON.stringify(flatTokens));

    const sd = new StyleDictionary({
      source: ['tokens-flat.json'],
      platforms: {
        css: {
          // On utilise les noms de transforms les plus stables
          transforms: [
            'name/kebab',   // Standard Style Dictionary (tirets)
            'ts/size/px',   // Tokens Studio (ajoute px)
            'ts/color/css/hex' // Tokens Studio (force hex)
          ],
          buildPath: 'build/css/',
          files: [{
            destination: 'variables.css',
            format: 'css/variables'
          }]
        }
      }
    });

    // On nettoie et on build
    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
    
    console.log('\n🚀 VICTOIRE !');
    console.log('Vérifie build/css/variables.css');

  } catch (err) {
    console.log('\n⚠️ Les transforms spécifiques bloquent encore. Passage en mode AUTO...');
    
    // PLAN C : On laisse Style Dictionary gérer le groupe complet
    const sdAuto = new StyleDictionary({
      source: ['tokens-flat.json'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio', 
          buildPath: 'build/css/',
          files: [{
            destination: 'variables.css',
            format: 'css/variables'
          }]
        }
      }
    });
    await sdAuto.buildAllPlatforms();
    console.log('\n✅ Build terminé en mode AUTO.');
  }
}

run();