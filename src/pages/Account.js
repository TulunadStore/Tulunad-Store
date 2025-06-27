// src/pages/Account.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaUserCircle, FaEdit, FaKey, FaMapMarkerAlt, FaBell, FaHistory, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AccountContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 160px);
  display: flex;
  gap: 30px;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AccountSidebar = styled(motion.div)`
  flex: 0 0 280px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 30px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 992px) {
    width: 100%;
    max-width: 500px;
    flex: none;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  svg {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1.8rem;
    color: var(--text-light);
    margin-bottom: 5px;
  }

  p {
    color: var(--text-dark);
    font-size: 0.9rem;
  }
`;

const SidebarButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.$active ? 'var(--primary-color)' : 'var(--text-light)'};
  font-size: 1.1rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 12px 15px;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--input-bg);
    color: var(--primary-color);
    transform: translateX(5px);
  }

  svg {
    font-size: 1.3rem;
  }
`;

const AccountContent = styled(motion.div)`
  flex: 1;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  overflow-y: auto;
  max-height: calc(100vh - 200px);

  @media (max-width: 992px) {
    width: 100%;
    max-width: 800px;
    padding: 25px;
  }
`;

const ContentTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 25px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ProfileSection = styled.div`
  h3 {
    font-size: 1.5rem;
    color: var(--text-light);
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 10px;
    color: var(--text-dark);
    strong {
      color: var(--text-light);
    }
  }
`;

const EditProfileForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--text-light);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color var(--transition-speed);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  grid-column: span 2;
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--hover-effect);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const ChangePasswordForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderHistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const OrderItem = styled(motion.li)`
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  color: var(--text-light);

  strong {
    color: var(--primary-color);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const SettingsGroup = styled.div`
  margin-bottom: 30px;

  h3 {
    font-size: 1.4rem;
    color: var(--primary-color);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    color: var(--text-dark);
    margin-bottom: 10px;
  }

  button {
    margin-right: 10px;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  width: 90%;
  max-width: 600px;
  border: 1px solid var(--primary-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 90vh;
  overflow-y: auto;

  h3 {
    color: var(--primary-color);
    font-size: 1.8rem;
    margin-bottom: 10px;
    text-align: center;
  }

  button {
    width: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: var(--primary-color);
    transform: rotate(90deg);
  }
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfilePicture = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid var(--primary-color);
  margin-bottom: 15px;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: 3rem;
    color: var(--text-dark);
  }
`;

const UploadButton = styled.label`
  background-color: var(--primary-color);
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--hover-effect);
  }

  input {
    display: none;
  }
`;

const AddressList = styled.div`
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--input-bg);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
`;

const AddressCard = styled.div`
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  position: relative;

  h4 {
    color: var(--primary-color);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin-bottom: 5px;
    color: var(--text-light);
  }

  .address-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;

    button {
      padding: 5px 10px;
      font-size: 0.8rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      transition: all var(--transition-speed);

      &:first-child {
        background-color: var(--primary-color);
        color: white;

        &:hover {
          background-color: var(--hover-effect);
        }
      }

      &:last-child {
        background-color: #dc3545;
        color: white;

        &:hover {
          background-color: #c82333;
        }
      }
    }
  }
`;

const NotificationSettings = styled.div`
  margin-top: 20px;
  background-color: var(--input-bg);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid var(--border-color);

  .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    span {
      font-size: 1rem;
      color: var(--text-light);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: var(--primary-color);
        }

        &:checked + .slider:before {
          transform: translateX(26px);
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;

        &:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
      }
    }
  }
`;

function Account() {
  const { currentUser, updateProfile, logout, updateUserAddresses, updateNotificationSettings } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileFormData, setProfileFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
  });
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [addressFormData, setAddressFormData] = useState({
    type: 'home',
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotions: true,
    priceDrops: true
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfileFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      });
      setProfileImage(currentUser.profileImageUrl || null);
      if (currentUser.notificationSettings) {
        setNotificationSettings(currentUser.notificationSettings);
      }
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const result = updateProfile(profileFormData);
    if (result && result.success) {
      toast.success("Profile updated successfully!");
      setModalOpen(false);
    } else {
      toast.error(result?.message || "Failed to update profile.");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordChangeData({ ...passwordChangeData, [e.target.name]: e.target.value });
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordChangeData.newPassword !== passwordChangeData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully! (Dummy)");
    setModalOpen(false);
    setPasswordChangeData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { fullName, address1, city, state, pincode, phone } = addressFormData;
    
    if (!fullName || !address1 || !city || !state || !pincode || !phone) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Pincode must be 6 digits.');
      return;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits.');
      return;
    }

    const newAddress = { ...addressFormData, id: editingAddressId || Date.now().toString() };
    const result = updateUserAddresses(newAddress, editingAddressId ? 'update' : 'add');
    
    if (result && result.success) {
      toast.success(editingAddressId ? 'Address updated!' : 'Address added!');
      setAddressFormData({
        type: 'home',
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        isDefault: false
      });
      setEditingAddressId(null);
      setModalOpen(false);
    } else {
      toast.error(result?.message || 'Failed to save address.');
    }
  };

  const handleEditAddress = (address) => {
    setAddressFormData(address);
    setEditingAddressId(address.id);
    setModalContent('addAddress');
    setModalOpen(true);
  };

  const handleDeleteAddress = (addressId) => {
    const result = updateUserAddresses(addressId, 'delete');
    if (result && result.success) {
      toast.success('Address deleted!');
    } else {
      toast.error(result?.message || 'Failed to delete address.');
    }
  };

  const handleNotificationChange = (setting) => {
    const newSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    };
    setNotificationSettings(newSettings);
    updateNotificationSettings(newSettings);
    toast.success('Notification settings updated!');
  };

  const dummyOrders = [
    { id: 'ORD001', date: '2023-10-26', total: 1998, status: 'Delivered', items: 2 },
    { id: 'ORD002', date: '2024-01-15', total: 499, status: 'Shipped', items: 1 },
    { id: 'ORD003', date: '2024-03-01', total: 3499, status: 'Processing', items: 3 },
  ];

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection>
            <ProfilePictureContainer>
              <ProfilePicture onClick={() => document.getElementById('profileUpload').click()}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <FaUserCircle />
                )}
              </ProfilePicture>
              <UploadButton>
                Change Photo
                <input 
                  id="profileUpload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                />
              </UploadButton>
            </ProfilePictureContainer>
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>Member Since:</strong> {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
            <SubmitButton onClick={() => openModal('editProfile')} whileTap={buttonClick}>
              <FaEdit /> Edit Profile
            </SubmitButton>
          </ProfileSection>
        );
      case 'orders':
        return (
          <>
            <SectionTitle>Order History</SectionTitle>
            <OrderHistoryList>
              {dummyOrders.length > 0 ? (
                dummyOrders.map(order => (
                  <OrderItem
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <strong>Order ID:</strong> {order.id} <br/>
                      <strong>Date:</strong> {order.date}
                    </div>
                    <div>
                      <strong>Total:</strong> ₹{order.total} <br/>
                      <strong>Status:</strong> {order.status}
                    </div>
                    <div>
                      <strong>Items:</strong> {order.items}
                    </div>
                  </OrderItem>
                ))
              ) : (
                <p style={{textAlign: 'center', color: 'var(--text-dark)'}}>You have no past orders.</p>
              )}
            </OrderHistoryList>
          </>
        );
      case 'settings':
        return (
          <>
            <SectionTitle>
              <FaBell /> Account Settings
            </SectionTitle>
            <SettingsGroup>
              <h3><FaKey /> Security & Login</h3>
              <p>Manage your password and security settings.</p>
              <SubmitButton onClick={() => openModal('changePassword')} whileTap={buttonClick}>
                <FaKey /> Change Password
              </SubmitButton>
            </SettingsGroup>

            <SettingsGroup>
              <h3><FaMapMarkerAlt /> Addresses</h3>
              <p>Add or edit your shipping and billing addresses.</p>
              <SubmitButton onClick={() => {
                setAddressFormData({
                  type: 'home',
                  fullName: '',
                  address1: '',
                  address2: '',
                  city: '',
                  state: '',
                  pincode: '',
                  phone: '',
                  isDefault: false
                });
                setEditingAddressId(null);
                openModal('addAddress');
              }} whileTap={buttonClick}>
                <FaMapMarkerAlt /> Add New Address
              </SubmitButton>
              
              <AddressList>
                {currentUser?.addresses?.length > 0 ? (
                  currentUser.addresses.map(address => (
                    <AddressCard key={address.id}>
                      <h4>
                        {address.type === 'home' ? '🏠 Home' : 
                         address.type === 'work' ? '🏢 Work' : 
                         '📍 Other'} {address.isDefault && '(Default)'}
                      </h4>
                      <p><strong>{address.fullName}</strong></p>
                      <p>{address.address1}, {address.address2 && `${address.address2}, `}</p>
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p><strong>Phone:</strong> {address.phone}</p>
                      <div className="address-actions">
                        <button onClick={() => handleEditAddress(address)}>Edit</button>
                        {!address.isDefault && (
                          <button onClick={() => {
                            updateUserAddresses(address.id, 'setDefault');
                            toast.success('Default address updated!');
                          }}>Set as Default</button>
                        )}
                        <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                      </div>
                    </AddressCard>
                  ))
                ) : (
                  <p style={{textAlign: 'center', color: 'var(--text-dark)'}}>No saved addresses yet.</p>
                )}
              </AddressList>
            </SettingsGroup>

            <SettingsGroup>
              <h3><FaBell /> Notifications</h3>
              <p>Control email and push notification preferences.</p>
              <NotificationSettings>
                <div className="notification-item">
                  <span><FaBell /> Email Notifications</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span><FaBell /> Push Notifications</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span><FaBell /> Order Updates</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.orderUpdates}
                      onChange={() => handleNotificationChange('orderUpdates')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span><FaBell /> Promotions & Offers</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.promotions}
                      onChange={() => handleNotificationChange('promotions')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="notification-item">
                  <span><FaBell /> Price Drop Alerts</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.priceDrops}
                      onChange={() => handleNotificationChange('priceDrops')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </NotificationSettings>
            </SettingsGroup>

            <SettingsGroup>
              <h3><FaSignOutAlt /> Logout</h3>
              <p>Securely log out from your account.</p>
              <SubmitButton onClick={logout} whileTap={buttonClick} style={{backgroundColor: '#dc3545'}}>
                <FaSignOutAlt /> Logout
              </SubmitButton>
            </SettingsGroup>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AccountContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <AccountSidebar
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SidebarHeader>
          <FaUserCircle />
          <h2>Hello, {currentUser?.firstName}!</h2>
          <p>{currentUser?.email}</p>
        </SidebarHeader>
        <SidebarButton
          $active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          whileHover={fadeIn}
          whileTap={buttonClick}
        >
          <FaUserCircle /> My Profile
        </SidebarButton>
        <SidebarButton
          $active={activeTab === 'orders'}
          onClick={() => setActiveTab('orders')}
          whileHover={fadeIn}
          whileTap={buttonClick}
        >
          <FaHistory /> Order History
        </SidebarButton>
        <SidebarButton
          $active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
          whileHover={fadeIn}
          whileTap={buttonClick}
        >
          <FaEdit /> Settings
        </SidebarButton>
        <SidebarButton
          onClick={logout}
          whileHover={fadeIn}
          whileTap={buttonClick}
          style={{ marginTop: 'auto', color: 'red' }}
        >
          <FaSignOutAlt /> Logout
        </SidebarButton>
      </AccountSidebar>

      <AccountContent
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <ContentTitle>
          {activeTab === 'profile' && <FaUserCircle />}
          {activeTab === 'orders' && <FaHistory />}
          {activeTab === 'settings' && <FaEdit />}
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
        </ContentTitle>
        {renderContent()}
      </AccountContent>

      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              <CloseButton onClick={() => setModalOpen(false)}><FaTimes /></CloseButton>
              {modalContent === 'editProfile' && (
                <>
                  <h3>Edit Profile</h3>
                  <EditProfileForm onSubmit={handleProfileSubmit}>
                    <FormGroup>
                      <Label htmlFor="editFirstName">First Name</Label>
                      <Input
                        type="text"
                        id="editFirstName"
                        name="firstName"
                        value={profileFormData.firstName}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="editLastName">Last Name</Label>
                      <Input
                        type="text"
                        id="editLastName"
                        name="lastName"
                        value={profileFormData.lastName}
                        onChange={handleProfileChange}
                      />
                    </FormGroup>
                    <FormGroup style={{gridColumn: 'span 2'}}>
                      <Label htmlFor="editEmail">Email Address</Label>
                      <Input
                        type="email"
                        id="editEmail"
                        name="email"
                        value={profileFormData.email}
                        onChange={handleProfileChange}
                        disabled
                      />
                    </FormGroup>
                    <SubmitButton type="submit" whileTap={buttonClick}>Save Changes</SubmitButton>
                  </EditProfileForm>
                </>
              )}
              {modalContent === 'changePassword' && (
                <>
                  <h3>Change Password</h3>
                  <ChangePasswordForm onSubmit={handleChangePasswordSubmit}>
                    <FormGroup>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordChangeData.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordChangeData.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                      <Input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={passwordChangeData.confirmNewPassword}
                        onChange={handlePasswordChange}
                      />
                    </FormGroup>
                    <SubmitButton type="submit" whileTap={buttonClick}>Update Password</SubmitButton>
                  </ChangePasswordForm>
                </>
              )}
              {modalContent === 'addAddress' && (
                <>
                  <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                  <form onSubmit={handleAddressSubmit}>
                    <FormGroup>
                      <Label>Address Type</Label>
                      <div style={{display: 'flex', gap: '15px'}}>
                        <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <input
                            type="radio"
                            name="type"
                            value="home"
                            checked={addressFormData.type === 'home'}
                            onChange={handleAddressChange}
                          />
                          Home
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <input
                            type="radio"
                            name="type"
                            value="work"
                            checked={addressFormData.type === 'work'}
                            onChange={handleAddressChange}
                          />
                          Work
                        </label>
                        <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <input
                            type="radio"
                            name="type"
                            value="other"
                            checked={addressFormData.type === 'other'}
                            onChange={handleAddressChange}
                          />
                          Other
                        </label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={addressFormData.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input
                        type="text"
                        id="address1"
                        name="address1"
                        value={addressFormData.address1}
                        onChange={handleAddressChange}
                        placeholder="House No., Building Name"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                      <Input
                        type="text"
                        id="address2"
                        name="address2"
                        value={addressFormData.address2}
                        onChange={handleAddressChange}
                        placeholder="Street, Area, Landmark"
                      />
                    </FormGroup>
                    <div style={{display: 'flex', gap: '20px'}}>
                      <FormGroup style={{flex: 1}}>
                        <Label htmlFor="city">City</Label>
                        <Input
                          type="text"
                          id="city"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleAddressChange}
                          placeholder="City"
                        />
                      </FormGroup>
                      <FormGroup style={{flex: 1}}>
                        <Label htmlFor="state">State</Label>
                        <Input
                          type="text"
                          id="state"
                          name="state"
                          value={addressFormData.state}
                          onChange={handleAddressChange}
                          placeholder="State"
                        />
                      </FormGroup>
                    </div>
                    <div style={{display: 'flex', gap: '20px'}}>
                      <FormGroup style={{flex: 1}}>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={addressFormData.pincode}
                          onChange={handleAddressChange}
                          placeholder="e.g., 575001"
                          maxLength="6"
                        />
                      </FormGroup>
                      <FormGroup style={{flex: 1}}>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={addressFormData.phone}
                          onChange={handleAddressChange}
                          placeholder="e.g., 9876543210"
                          maxLength="10"
                        />
                      </FormGroup>
                    </div>
                    <FormGroup>
                      <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addressFormData.isDefault}
                          onChange={handleAddressChange}
                        />
                        Set as default address
                      </label>
                    </FormGroup>
                    <SubmitButton type="submit" whileTap={buttonClick}>
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </SubmitButton>
                  </form>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </AccountContainer>
  );
}

export default Account;