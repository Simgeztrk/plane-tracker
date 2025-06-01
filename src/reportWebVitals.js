// reportWebVitals i fonksiyonu,  web sitesinin performans ölçüm fonksiyonlarını çalıştırmak için kullandık.
const reportWebVitals = (onPerfEntry) => {
  // Eğer onPerfEntry bir fonksiyonsa (geçerli bir callback verilmişse)
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dinamik olarak 'web-vitals' modülünü içe aktar
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Web performansı ile ilgili metrikleri ölç ve geri dönüş fonksiyonuna ilet

      // CLS (Cumulative Layout Shift) ölçümünü yap
      getCLS(onPerfEntry);

      // FID (First Input Delay) ölçümünü yap
      getFID(onPerfEntry);

      // FCP (First Contentful Paint) ölçümünü yap
      getFCP(onPerfEntry);

      //LCP (Largest Contentful Paint) ölçümünü yap
      getLCP(onPerfEntry);

      // TTFB (Time To First Byte) ölçümünü yap
      getTTFB(onPerfEntry);
    });
  }
};

// Bu fonksiyonu dışa aktararak başka dosyalarda kullanılabilir hale getir
export default reportWebVitals;
