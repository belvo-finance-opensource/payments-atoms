/**
 * Creates an object with a single key-value pair if the value is defined, otherwise returns an empty object.
 * This utility is useful for conditionally adding properties to objects.
 *
 * @param key - The key to use in the resulting object
 * @param value - The optional value to associate with the key
 * @returns An object with the key-value pair if value is defined, or an empty object if value is undefined
 *
 * @example
 * optionalField('name', 'John')  // Returns { name: 'John' }
 * optionalField('age', undefined) // Returns {}
 * optionalField('count', 0)      // Returns { count: 0 }
 * optionalField('items', null)    // Returns { items: null }
 */
export const optionalField = (key: string, value?: unknown) => (value ? { [key]: value } : {})
