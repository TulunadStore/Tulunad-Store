// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { pageTransition, fadeIn, buttonClick } from '../utils/animations';
import { FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CheckoutContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 160px);
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 50px;
  color: var(--primary-color);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CheckoutStepper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--border-color);
    z-index: 1;
  }
`;

const Step = styled(motion.div)`
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 2;

  span {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--input-bg)'};
    color: ${props => props.$active ? 'white' : 'var(--text-dark)'};
    line-height: 40px;
    margin: 0 auto 10px;
    font-weight: 700;
    border: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
    transition: all var(--transition-speed);
  }

  p {
    font-size: 0.9rem;
    color: ${props => props.$active ? 'var(--text-light)' : 'var(--text-dark)'};
    font-weight: ${props => props.$active ? '600' : '400'};
  }
`;

const CheckoutSection = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 25px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color var(--transition-speed);
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%236B7280' d='M9.293 12.95l.707.707L15.293 8l-1.414-1.414L10 10.172l-3.879-3.879L4.707 8 10 13.293z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const HalfWidth = styled(FormGroup)`
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  button {
    min-width: 120px;
    padding: 12px 20px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-speed);

    &:hover {
      background-color: var(--hover-effect);
      transform: translateY(-2px);
    }
  }

  button:first-child {
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    &:hover {
      background-color: var(--input-bg);
      color: var(--hover-effect);
    }
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  background-color: var(--input-bg);
  border: 1px solid ${props => props.$checked ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all var(--transition-speed);

  &:hover {
    box-shadow: 0 0 10px rgba(var(--primary-color-rgb), 0.2);
    border-color: var(--primary-color);
  }

  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary-color);
    border-radius: 50%;
    margin-right: 15px;
    position: relative;
    cursor: pointer;

    &:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    &:checked::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background-color: white;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  span {
    font-size: 1.1rem;
    color: var(--text-light);
    font-weight: 500;
  }
`;

const UPIInfo = styled(motion.div)`
  background-color: rgba(var(--primary-color-rgb), 0.1);
  border: 1px dashed var(--primary-color);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
  color: var(--primary-color);
  font-weight: 600;

  p {
    margin-bottom: 10px;
    font-size: 1rem;
  }

  span {
    display: block;
    font-size: 1.2rem;
    color: var(--text-light);
    background-color: var(--input-bg);
    padding: 8px 15px;
    border-radius: 5px;
    margin-top: 10px;
    letter-spacing: 0.5px;
  }

  img {
    max-width: 150px;
    height: auto;
    margin-top: 15px;
    border-radius: 5px;
    background-color: white; /* QR code usually has white background */
    padding: 5px;
  }
`;

const OrderSummaryCard = styled.div`
  background-color: var(--input-bg);
  border-radius: 10px;
  padding: 25px;
  margin-top: 25px;
  border: 1px solid var(--border-color);

  h3 {
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 20px;
    text-align: center;
  }

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 1rem;
    color: var(--text-dark);
  }

  strong {
    color: var(--text-light);
  }

  .total-row {
    border-top: 1px dashed var(--border-color);
    padding-top: 15px;
    margin-top: 15px;
    font-size: 1.3rem;
    color: var(--primary-color);
    font-weight: 700;
  }
`;

const OrderConfirmation = styled(motion.div)`
  text-align: center;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 60px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--primary-color);
  color: var(--text-light);

  svg {
    font-size: 4rem;
    color: var(--primary-color);
    margin-bottom: 20px;
  }

  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 30px;
  }

  a {
    background-color: var(--primary-color);
    color: white;
    padding: 12px 30px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-speed);

    &:hover {
      background-color: var(--hover-effect);
      transform: translateY(-2px);
    }
  }
`;

const OrderForFriendSection = styled(motion.div)`
  background-color: var(--input-bg);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border: 1px dashed var(--primary-color);

  h4 {
    color: var(--primary-color);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  label {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    color: var(--text-light);
  }

  input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
  }
`;

const FriendDetails = styled(motion.div)`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed var(--border-color);
`;

const AddressSelectionContainer = styled.div`
  margin-bottom: 20px;
  background-color: var(--input-bg);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const AddressCard = styled.div`
  background-color: var(--dark-card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }

  h4 {
    color: var(--primary-color);
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin-bottom: 3px;
    color: var(--text-light);
    font-size: 0.95rem;
  }

  strong {
    color: var(--primary-color);
  }
`;

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser } = useAuth(); // Get current user from AuthContext

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [friendShippingInfo, setFriendShippingInfo] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderForFriend, setOrderForFriend] = useState(false);
  const [friendGiftMessage, setFriendGiftMessage] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('new'); // 'new' for new address, or address.id

  const shippingCost = 50; // Dummy shipping cost
  const totalAmount = getTotalPrice() + shippingCost;

  useEffect(() => {
    if (currentUser && currentUser.addresses && currentUser.addresses.length > 0 && !orderForFriend) {
      const defaultAddress = currentUser.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setShippingInfo(defaultAddress);
        setSelectedAddressId(defaultAddress.id);
      } else {
        setShippingInfo(currentUser.addresses[0]); // Select first if no default
        setSelectedAddressId(currentUser.addresses[0].id);
      }
    } else if (!orderForFriend) { // If no addresses or not ordering for friend, reset to new address
      setSelectedAddressId('new');
      setShippingInfo({
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
      });
    }
  }, [currentUser, orderForFriend]); // Added orderForFriend to dependency array

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleFriendShippingChange = (e) => {
    setFriendShippingInfo({ ...friendShippingInfo, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShippingInfo({
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
      });
    } else {
      const selected = currentUser.addresses.find(addr => addr.id === addressId);
      if (selected) {
        setShippingInfo(selected);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      let addressToValidate;

      if (orderForFriend) {
        addressToValidate = friendShippingInfo;
      } else {
        addressToValidate = shippingInfo;
      }

      const { fullName, address1, city, state, pincode, phone } = addressToValidate;

      if (!fullName || !address1 || !city || !state || !pincode || !phone) {
        toast.error('Please fill in all required shipping details.');
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
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }
    // Simulate order placement
    toast.success('Order placed successfully!');
    clearCart(); // Clear cart after successful order
    setCurrentStep(prev => prev + 1); // Move to confirmation step
  };

  // If cart is empty, redirect to cart page
  if (cartItems.length === 0 && currentStep !== 4) {
    toast.error('Your cart is empty. Add items before checking out!');
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Checkout
      </PageTitle>

      {currentStep <= 3 && (
        <CheckoutStepper>
          <Step $active={currentStep >= 1} variants={fadeIn} initial="initial" animate="animate">
            <span>1</span>
            <p>Shipping</p>
          </Step>
          <Step $active={currentStep >= 2} variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <span>2</span>
            <p>Payment</p>
          </Step>
          <Step $active={currentStep >= 3} variants={fadeIn} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <span>3</span>
            <p>Review & Place Order</p>
          </Step>
        </CheckoutStepper>
      )}

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <CheckoutSection
            key="shipping"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
          >
            <SectionTitle>Shipping Information</SectionTitle>

            {!orderForFriend && currentUser?.addresses?.length > 0 && (
              <AddressSelectionContainer>
                <Label htmlFor="savedAddress">Select a saved address or add new:</Label>
                <Select id="savedAddress" onChange={handleAddressSelect} value={selectedAddressId}>
                  {currentUser.addresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.fullName} - {address.address1}, {address.city} ({address.isDefault ? 'Default' : address.type})
                    </option>
                  ))}
                  <option value="new">Add New Address</option>
                </Select>
              </AddressSelectionContainer>
            )}

            {orderForFriend ? (
              <>
                <FormGroup>
                  <Label htmlFor="friendFullName">Friend's Full Name</Label>
                  <Input
                    type="text"
                    id="friendFullName"
                    name="fullName"
                    value={friendShippingInfo.fullName}
                    onChange={handleFriendShippingChange}
                    placeholder="Enter friend's full name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="friendAddress1">Friend's Address Line 1</Label>
                  <Input
                    type="text"
                    id="friendAddress1"
                    name="address1"
                    value={friendShippingInfo.address1}
                    onChange={handleFriendShippingChange}
                    placeholder="Friend's House No., Building Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="friendAddress2">Friend's Address Line 2 (Optional)</Label>
                  <Input
                    type="text"
                    id="friendAddress2"
                    name="address2"
                    value={friendShippingInfo.address2}
                    onChange={handleFriendShippingChange}
                    placeholder="Friend's Street, Area, Landmark"
                  />
                </FormGroup>
                <FlexContainer>
                  <HalfWidth>
                    <Label htmlFor="friendCity">Friend's City</Label>
                    <Input
                      type="text"
                      id="friendCity"
                      name="city"
                      value={friendShippingInfo.city}
                      onChange={handleFriendShippingChange}
                      placeholder="Friend's City"
                    />
                  </HalfWidth>
                  <HalfWidth>
                    <Label htmlFor="friendState">Friend's State</Label>
                    <Input
                      type="text"
                      id="friendState"
                      name="state"
                      value={friendShippingInfo.state}
                      onChange={handleFriendShippingChange}
                      placeholder="Friend's State"
                    />
                  </HalfWidth>
                </FlexContainer>
                <FlexContainer>
                  <HalfWidth>
                    <Label htmlFor="friendPincode">Friend's Pincode</Label>
                    <Input
                      type="text"
                      id="friendPincode"
                      name="pincode"
                      value={friendShippingInfo.pincode}
                      onChange={handleFriendShippingChange}
                      placeholder="e.g., 575001"
                      maxLength="6"
                    />
                  </HalfWidth>
                  <HalfWidth>
                    <Label htmlFor="friendPhone">Friend's Phone Number</Label>
                    <Input
                      type="tel"
                      id="friendPhone"
                      name="phone"
                      value={friendShippingInfo.phone}
                      onChange={handleFriendShippingChange}
                      placeholder="e.g., 9876543210"
                      maxLength="10"
                    />
                  </HalfWidth>
                </FlexContainer>
              </>
            ) : (selectedAddressId === 'new' ? (
              <>
                <FormGroup>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    placeholder="Enter full name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    type="text"
                    id="address1"
                    name="address1"
                    value={shippingInfo.address1}
                    onChange={handleShippingChange}
                    placeholder="House No., Building Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    type="text"
                    id="address2"
                    name="address2"
                    value={shippingInfo.address2}
                    onChange={handleShippingChange}
                    placeholder="Street, Area, Landmark"
                  />
                </FormGroup>
                <FlexContainer>
                  <HalfWidth>
                    <Label htmlFor="city">City</Label>
                    <Input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="City"
                    />
                  </HalfWidth>
                  <HalfWidth>
                    <Label htmlFor="state">State</Label>
                    <Input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      placeholder="State"
                    />
                  </HalfWidth>
                </FlexContainer>
                <FlexContainer>
                  <HalfWidth>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={shippingInfo.pincode}
                      onChange={handleShippingChange}
                      placeholder="e.g., 575001"
                      maxLength="6"
                    />
                  </HalfWidth>
                  <HalfWidth>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="e.g., 9876543210"
                      maxLength="10"
                    />
                  </HalfWidth>
                </FlexContainer>
              </>
            ) : (
              // Display selected saved address details
              <AddressCard>
                <h4><FaMapMarkerAlt /> {shippingInfo.fullName} {shippingInfo.isDefault && '(Default)'}</h4>
                <p>{shippingInfo.address1}, {shippingInfo.address2 && `${shippingInfo.address2}, `}</p>
                <p>{shippingInfo.city}, {shippingInfo.state} - <strong>{shippingInfo.pincode}</strong></p>
                <p><strong>Phone:</strong> {shippingInfo.phone}</p>
              </AddressCard>
            ))}

            <OrderForFriendSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4>
                <input
                  type="checkbox"
                  id="orderForFriend"
                  checked={orderForFriend}
                  onChange={(e) => {
                    setOrderForFriend(e.target.checked);
                    if (e.target.checked) {
                      // Clear friend's address and gift message when checking
                      setFriendShippingInfo({
                        fullName: '',
                        address1: '',
                        address2: '',
                        city: '',
                        state: '',
                        pincode: '',
                        phone: '',
                      });
                      setFriendGiftMessage('');
                    } else {
                      // If unchecking, reset shippingInfo to user's default/first address or empty if none
                      if (currentUser?.addresses?.length > 0) {
                        const defaultAddress = currentUser.addresses.find(addr => addr.isDefault);
                        if (defaultAddress) {
                          setShippingInfo(defaultAddress);
                          setSelectedAddressId(defaultAddress.id);
                        } else {
                          setShippingInfo(currentUser.addresses[0]);
                          setSelectedAddressId(currentUser.addresses[0].id);
                        }
                      } else {
                        setShippingInfo({
                          fullName: '',
                          address1: '',
                          address2: '',
                          city: '',
                          state: '',
                          pincode: '',
                          phone: '',
                        });
                        setSelectedAddressId('new');
                      }
                    }
                  }}
                />
                <label htmlFor="orderForFriend">Order for a friend</label>
              </h4>

              {orderForFriend && (
                <FriendDetails
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormGroup>
                    <Label htmlFor="friendGiftMessage">Gift Message (Optional)</Label>
                    <Input
                      as="textarea"
                      id="friendGiftMessage"
                      name="message"
                      value={friendGiftMessage}
                      onChange={(e) => setFriendGiftMessage(e.target.value)}
                      placeholder="Add a personal message"
                      rows="3"
                    />
                  </FormGroup>
                </FriendDetails>
              )}
            </OrderForFriendSection>

            <ButtonGroup>
              <button onClick={() => navigate('/cart')} whileTap={buttonClick}>Back to Cart</button>
              <button onClick={handleNextStep} whileTap={buttonClick}>Continue to Payment</button>
            </ButtonGroup>
          </CheckoutSection>
        )}

        {currentStep === 2 && (
          <CheckoutSection
            key="payment"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
          >
            <SectionTitle>Payment Method</SectionTitle>
            <PaymentOptions>
              <PaymentOption $checked={paymentMethod === 'upi'}>
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI / QR Code Payment</span>
              </PaymentOption>
              {paymentMethod === 'upi' && (
                <UPIInfo
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>Scan the QR code or pay to the UPI ID:</p>
                  <span>tulunadstore@upi</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_UPI_payment.png" alt="UPI QR Code" />
                  <p style={{fontSize: '0.8rem', marginTop: '15px', color: 'var(--text-dark)'}}>*Please complete payment within 10 minutes to avoid order cancellation.</p>
                </UPIInfo>
              )}
              <PaymentOption $checked={paymentMethod === 'cod'}>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery (COD)</span>
              </PaymentOption>
            </PaymentOptions>
            <ButtonGroup>
              <button onClick={handlePrevStep} whileTap={buttonClick}>Back to Shipping</button>
              <button onClick={handleNextStep} whileTap={buttonClick}>Review Order</button>
            </ButtonGroup>
          </CheckoutSection>
        )}

        {currentStep === 3 && (
          <CheckoutSection
            key="review"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
          >
            <SectionTitle>Review Your Order</SectionTitle>
            <OrderSummaryCard>
              <h3>Order Items</h3>
              {cartItems.map(item => (
                <div key={item.id}>
                  <span>{item.name} (x{item.quantity})</span>
                  <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
              <div style={{marginTop: '20px'}}>
                <span>Shipping:</span>
                <strong>₹{shippingCost.toFixed(2)}</strong>
              </div>
              <div className="total-row">
                <span>Total:</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
            </OrderSummaryCard>

            <OrderSummaryCard style={{marginTop: '30px'}}>
              <h3>Shipping Address</h3>
              {orderForFriend ? (
                <>
                  <div><strong>Friend's Name:</strong> <span>{friendShippingInfo.fullName}</span></div>
                  <div><strong>Friend's Address:</strong> <span>{friendShippingInfo.address1}, {friendShippingInfo.address2 ? `${friendShippingInfo.address2}, ` : ''}{friendShippingInfo.city}, {friendShippingInfo.state} - {friendShippingInfo.pincode}</span></div>
                  <div><strong>Friend's Phone:</strong> <span>{friendShippingInfo.phone}</span></div>
                </>
              ) : (
                <>
                  <div><strong>Name:</strong> <span>{shippingInfo.fullName}</span></div>
                  <div><strong>Address:</strong> <span>{shippingInfo.address1}, {shippingInfo.address2 ? `${shippingInfo.address2}, ` : ''}{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</span></div>
                  <div><strong>Phone:</strong> <span>{shippingInfo.phone}</span></div>
                </>
              )}
            </OrderSummaryCard>

            {orderForFriend && (
              <OrderSummaryCard style={{ marginTop: '20px' }}>
                <h3>Gift Information</h3>
                {friendGiftMessage && (
                  <div><strong>Message:</strong> <span>{friendGiftMessage}</span></div>
                )}
              </OrderSummaryCard>
            )}

            <OrderSummaryCard style={{marginTop: '30px'}}>
              <h3>Payment Method</h3>
              <div><strong>Method:</strong> <span>{paymentMethod === 'upi' ? 'UPI / QR Code' : 'Cash on Delivery'}</span></div>
            </OrderSummaryCard>

            <ButtonGroup>
              <button onClick={handlePrevStep} whileTap={buttonClick}>Back</button>
              <button onClick={handlePlaceOrder} whileTap={buttonClick}>Place Order</button>
            </ButtonGroup>
          </CheckoutSection>
        )}

        {currentStep === 4 && (
          <OrderConfirmation
            key="confirmation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaCheckCircle />
            <h2>Order Placed Successfully!</h2>
            <p>Your order #{Math.floor(Math.random() * 1000000)} has been received and will be processed shortly. You will receive an email confirmation.</p>
            <Link to="/" whileTap={buttonClick}>Continue Shopping</Link>
          </OrderConfirmation>
        )}
      </AnimatePresence>
    </CheckoutContainer>
  );
}

export default Checkout;