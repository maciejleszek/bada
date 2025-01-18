export const validateForm = (data, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      if (rules[field].required && !data[field]) {
        errors[field] = `${field} is required`;
      }
      if (rules[field].minLength && data[field].length < rules[field].minLength) {
        errors[field] = `${field} must be at least ${rules[field].minLength} characters`;
      }
      if (rules[field].pattern && !rules[field].pattern.test(data[field])) {
        errors[field] = `${field} format is invalid`;
      }
    });
    
    return errors;
  };