


const actionToPlainObject = (store: any) => (next: any) => (action: any) => next({...action});


export default [actionToPlainObject];

