## Installation

```
npm install react-native-woopra -g
```

## Usage

```js
const Woopra = require('react-native-woopra').shared();
Woopra.domain = 'yourdomain.com';

Woopra.client({
  app: 'react-native',
}).identify({
  email: 'john@doe.com',
  name: 'John Doe',
}).track('login', {
  method: 'email',
}).then(() => {
  console.log('Event logged');
});
```
