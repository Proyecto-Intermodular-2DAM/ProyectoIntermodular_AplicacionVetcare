import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import '../theme/css/MainLayout.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <IonPage>
            <div className="main-layout">
                <SideMenu />
                <div className="main-content-wrapper">
                    <TopBar />
                    <IonContent className="main-scrollable-content">
                        {children}
                    </IonContent>
                </div>
            </div>
        </IonPage>
    );
};

export default MainLayout;
