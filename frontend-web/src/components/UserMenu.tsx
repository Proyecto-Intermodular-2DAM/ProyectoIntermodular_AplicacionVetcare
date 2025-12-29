import React from 'react';
import { IonIcon } from '@ionic/react';
import { person, logOutOutline } from 'ionicons/icons';
import '../theme/css/UserMenu.css';

interface UserMenuProps {
    onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
    return (
        <div className="user-menu-container">
            <div className="user-menu-header">
                <div className="menu-user-avatar">
                    P
                </div>
                <span className="menu-user-name">Raul</span>
            </div>

            <div className="user-menu-list">
                <div className="user-menu-item" onClick={() => console.log('Editar perfil')}>
                    <IonIcon icon={person} />
                    <span>Editar Perfil</span>
                </div>

                <div className="user-menu-item" onClick={() => console.log('Cerrar sesión')}>
                    <IonIcon icon={logOutOutline} style={{ transform: 'rotate(180deg)' }} />
                    {/* Image uses an icon that looks like exit/enter, ionic log-out usually points right. 
                        If image shows arrow POINTING OUT TO RIGHT, standard logOut is fine.
                        Image shows Box with Arrow pointing RIGHT. Standard logOutOutline is Box with arrow pointing RIGHT.
                        Wait, standard logOut often points RIGHT. 
                        Let's check the image again. 
                        Image icon: Box on left, arrow pointing RIGHT out of it. 
                        This is standard logOutOutline or exitOutline. 
                        Wait, standard logOut is usually box with arrow pointing LEFT (log in) or RIGHT (log out). 
                        I'll stick with logOutOutline. layout matches image. 
                        Image shows "person" icon is filled. person (filled) or personOutline. 
                        Image shows filled head/shoulders. `person` is filled in Ionons 5+. 
                    */}
                    <span>Cerrar Sesión</span>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
