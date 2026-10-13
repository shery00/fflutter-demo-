import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidFrame } from './components/common/AndroidFrame';
import { FlutterCodeModal } from './components/common/FlutterCodeModal';
import { ApkOptimizerModal } from './components/common/ApkOptimizerModal';
import { HomeScreen } from './screens/HomeScreen';
import { CustomizationScreen } from './screens/CustomizationScreen';
import { CartScreen } from './screens/CartScreen';
import { PlaceOrderScreen } from './screens/PlaceOrderScreen';
import { OrderSummaryScreen } from './screens/OrderSummaryScreen';
import { OrderHistoryScreen } from './screens/OrderHistoryScreen';

const MainScreenRouter: React.FC = () => {
  const { screen, theme, showApkModal, setShowApkModal } = useApp();

  // Sync dark class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen />;
      case 'customization':
        return <CustomizationScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <PlaceOrderScreen />;
      case 'summary':
        return <OrderSummaryScreen />;
      case 'history':
        return <OrderHistoryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <AndroidFrame>
      {renderScreen()}
      <FlutterCodeModal />
      <ApkOptimizerModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </AndroidFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreenRouter />
    </AppProvider>
  );
}
