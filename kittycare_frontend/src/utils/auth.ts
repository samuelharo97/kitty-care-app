import { CatFormData } from '../types/cat.types';
import { AuthToken } from './types';

export const setAuthToken = (authData: AuthToken) => {
  console.log("setAuthToken", authData);

  localStorage.setItem('email', authData.email);
  localStorage.setItem('token', authData.token);
  // Convert seconds to milliseconds by multiplying by 1000
  const expiresAt = new Date().getTime() + (parseInt(authData.expiresIn) * 1000);
  localStorage.setItem('expiresAt', expiresAt.toString());
  if(authData.photo)  localStorage.setItem('photo', authData.photo);
};

export const clearTokens = () => {
  const keysToRemove = [
    "token",
    "expiresAt",
    "catId",
    "ConversationId",
    "activity_level",
    "age",
    "cat_name",
    "breed",
    "check_in_period",
    "country",
    "dietary_restrictions",
    "gender",
    "goals",
    "issues_faced",
    "items",
    "medical_conditions",
    "medications",
    "required_progress",
    "selectedDate",
    "medical_history",
    "target_weight",
    "training_days",
    "unit",
    "weight",
    "zipcode",
    "food_bowls",
    "treats",
    "playtime",
    "subscriptionId",
    "goals",
    "issues_identified",
    "required_progress",
    "paymentMade",
    "catFormData",
    "email"
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

export const isAuthenticated = (): null | any => {
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');
  
  if (!token || !expiresAt) return null;
  
  const isValid = new Date().getTime() < parseInt(expiresAt);
  if(!isValid) return null;
  
  try {
    // Get user info from token
    const payload = token.split('.')[1];
    const user = JSON.parse(atob(payload));
    
    return user;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Helper to parse expiration time (e.g., "1h" to milliseconds)
// const parseExpirationTime = (expiresIn: string): number => {
//   const unit = expiresIn.slice(-1);
//   const value = parseInt(expiresIn.slice(0, -1));
  
//   switch (unit) {
//     case 'd': return value * 24 * 60 * 60 * 1000;
//     case 'h': return value * 60 * 60 * 1000;
//     case 'm': return value * 60 * 1000;
//     case 's': return value * 1000;
//     default: return 0;
//   }
// }; 

export const collectFormData = (): CatFormData => {
  return {
    name: localStorage.getItem('cat_name'),
    goals: localStorage.getItem('goals'),
    issues_faced: localStorage.getItem('issues_faced'),
    activity_level: localStorage.getItem('activity_level'),
    gender: localStorage.getItem('gender'),
    age: parseInt(localStorage.getItem('age') || '0'),
    breed: localStorage.getItem('breed'),
    weight: parseFloat(localStorage.getItem('weight') || '0'),
    target_weight: parseFloat(localStorage.getItem('target_weight') || '0'),
    required_progress: localStorage.getItem('required_progress'),
    check_in_period: localStorage.getItem('check_in_period'),
    training_days: localStorage.getItem('training_days'),
    medical_conditions: localStorage.getItem('medical_conditions'),
    medications: localStorage.getItem('medications'),
    dietary_restrictions: localStorage.getItem('dietary_restrictions'),
    medical_history: localStorage.getItem('medical_history'),
    items: localStorage.getItem('items'),
  };
};