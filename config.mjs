import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

// 1. On enregistre tout. Cela crée des transforms nommées "ts/size/px", etc.
register(StyleDictionary);

StyleDictionary.registerTransform({
  name: 'ex-shadow/boxshadow-shorthand',
  type: 'value',
  transitive: true,
  matcher: (token) => {
    // On ne transforme QUE si c'est un objet ET qu'il a une propriété spécifique aux ombres
    return (
      typeof token.value === 'object' && 
      token.value !== null && 
      (token.type === 'boxShadow' || token.type === 'innerShadow' || token.type === 'dropShadow' || 'blur'  in token.value)
    );
  },
  transform: (token) => {
    // Si par erreur on arrive ici avec une valeur qui n'est pas un objet, on renvoie la valeur telle quelle
    if (typeof token.value !== 'object') return token.value;

    const { x = 0, y = 0, blur = 0, spread = 0, color = 'transparent' } = token.value;
    
    const addPx = (val) => {
      if (val === "" || val === undefined || val === null) return '0px';
      return isNaN(val) ? val : `${val}px`;
    };

    return `${addPx(x)} ${addPx(y)} ${addPx(blur)} ${addPx(spread)} ${color}`;
  }
});

async function run() {
  try {
    const rawData = JSON.parse(fs.readFileSync('./tokens.json', 'utf8'));
    const flatTokens = { ...rawData["Primitives"], ...rawData["Tokens"] };

/*// Parcourir les tokens pour changer le type dropShadow et innerShadow en shadow
Object.values(flatTokens).forEach(token => {
  if (token.type === 'boxShadow' || token.type === 'innerShadow') {
    token.type = 'shadow';
  }
});*/



    fs.writeFileSync('./tokens-flat.json', JSON.stringify(flatTokens));

    const sdAuto = new StyleDictionary({
      source: ['tokens-flat.json'],
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab', 'size/px','ex-shadow/boxshadow-shorthand'

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
    await sdAuto.cleanAllPlatforms();
    await sdAuto.buildAllPlatforms();
    
    console.log('\n🚀 VICTOIRE !');
    console.log('Vérifie build/css/variables.css');

  } catch (err) {
    console.log('\n⚠️ Les transforms spécifiques bloquent encore');
    

  }
}

run();