// Bu dosya, PostCSS yapılandırmasını içerir
// TailwindCSS ve Autoprefixer eklentilerini PostCSS ile projeye entegre ediyoruz
export default {
  plugins: {
    tailwindcss: {}, // TailwindCSS'i etkinleştirir
    autoprefixer: {}, // CSS'e tarayıcı uyumluluğu için vendor prefix'leri otomatik ekler
    // vendor prefix- Tarayıcıların bazı CSS özelliklerini erken deneme veya kendi özel versiyonlarıyla kullanma şeklidir.
  },
};
