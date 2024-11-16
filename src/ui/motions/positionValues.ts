export   const getPositionValues = () => {
    if (window.innerWidth < 480) {
    // Pantallas muy pequeñas (móviles)
      return { top: "12%", left: "23%" };
    } else if (window.innerWidth < 780) {
    // Pantallas pequeñas (tabletas pequeñas)
      return { top: "12%", left: "31%" };
    } else if (window.innerWidth < 1200) {
    // Pantallas medianas (tabletas grandes o pantallas pequeñas de escritorio)
      return { top: "0%", left: "30%" };
      
    }else if (window.innerWidth < 1600) {
      
      return { top: "8%", left: "10%"  };
    // Pantallas grandes 
    }else if (window.innerWidth < 2000) {

      return { top: "20%", left: "12%"  };
    
    }else {
      // Pantallas muy grandes
      return { top: "26%", left: "15%" };
    }
  };
  