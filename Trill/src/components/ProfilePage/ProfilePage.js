import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    image: "",
    phone: "",
    location: "",
    birthday: "",
    age: "",
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth, db]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle profile picture upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    try {
      const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          alert("Upload failed. Please try again.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUserData((prevData) => ({ ...prevData, image: downloadURL }));
          alert("Profile picture updated successfully!");
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting the profile picture
  const handleDeleteImage = async () => {
    try {
      const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
      await deleteObject(storageRef);
      setUserData((prevData) => ({ ...prevData, image: "/default-avatar.png" }));
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  // Save all changes to Firestore
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        console.log("Saving data:", userData); // Debugging
        await setDoc(userDoc, userData, { merge: true });
        alert("Profile updated successfully!");
      } else {
        alert("You are not logged in. Please log in and try again.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle updating input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={userData.image || "/default-avatar.png"} alt="User Avatar" className="profile-image" />
        <button onClick={handleDeleteImage} disabled={isLoading}>
          Delete Profile Picture
        </button>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="content-area">
        <div className="input-field">
          <label>Username:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={userData.birthday}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-field">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={userData.age}
            onChange={handleInputChange}
          />
        </div>

        <div className="input-field">
          <label>Upload Profile Picture:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload} disabled={isLoading}>
            Upload
          </button>
        </div>

        <button onClick={handleSave} disabled={isLoading}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
