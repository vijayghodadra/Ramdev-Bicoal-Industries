import peanutDefault from '../assets/B6.jpg';
import chanaDefault from '../assets/R1.jpg';
import tuwarDefault from '../assets/B8.jpg';
import wheatDefault from '../assets/B10.jpg';
import cardsDefault from '../assets/j1.jpg';
import machineMayorDefault from '../assets/M4.jpg';
import kabuliDefault from '../assets/B3.jpg';

const DEFAULT_IMAGES = {
  home_hero_bg: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=2000&auto=format&fit=crop',
  peanut: peanutDefault,
  chana: chanaDefault,
  tuwar: tuwarDefault,
  wheat: wheatDefault,
  kabuli: kabuliDefault,
  cards_img: cardsDefault,
  machine_mayor: machineMayorDefault
};

export const getImageUrl = (key) => {
  try {
    const saved = localStorage.getItem(`somnath_img_${key}`);
    return saved || DEFAULT_IMAGES[key];
  } catch (e) {
    return DEFAULT_IMAGES[key];
  }
};

export const setImageUrl = (key, url) => {
  try {
    if (url && url.trim() !== '') {
      localStorage.setItem(`somnath_img_${key}`, url.trim());
    } else {
      localStorage.removeItem(`somnath_img_${key}`);
    }
  } catch (e) {
    console.error('Error setting image URL:', e);
  }
};

export const resetImages = () => {
  try {
    Object.keys(DEFAULT_IMAGES).forEach(key => {
      localStorage.removeItem(`somnath_img_${key}`);
    });
  } catch (e) {
    console.error('Error resetting images:', e);
  }
};
