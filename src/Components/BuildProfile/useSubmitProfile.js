"use client";

import { get, set, ref as dbRef } from "firebase/database";
import { signOut } from "firebase/auth";
import axios from "axios";

const useSubmitProfile = ({
  user,
  appUsername,
  profileImg,
  selectedInstitution,
  selectedDegree,
  intrests,
  database,
  auth,
  navigateToDashboard,
  setIsSaved,
  setAppUsername,
  setProfileImg,
  setSelectedFile,
  navigate
}) => {
  const submitHandler = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (
      appUsername.length <= 10 &&
      appUsername &&
      profileImg &&
      selectedInstitution &&
      intrests.length &&
      selectedDegree
    ) {
      try {
        const snapshot = await get(dbRef(database, "/"));
        const allUsers = snapshot.val();

        const isUsernameTaken = Object.values(allUsers || {}).some((u) => {
          return u.Profile && u.Profile.appUsername === appUsername;
        });

        if (isUsernameTaken) {
          console.log("Username already taken");
          return;
        }

        const profileData = {
          appUsername,
          profileImg,
          selectedInstitution: selectedInstitution.value,
          intrests,
          selectedDegree: selectedDegree.value,
        };

        await set(dbRef(database, user.uid + "/Profile/"), profileData);

        try {
          await axios.post("http://localhost:9090/api/users", {
            command: "findUser",
            data: { userID: user.uid },
          });

          try {
            await axios.post("http://localhost:9090/api/users", {
              command: "updateUser",
              data: {
                userID: user.uid,
                selectedDegree: selectedDegree.value,
                email: user.email,
                appUsername: appUsername,
                selectedInstitution: selectedInstitution.value,
                intrests: intrests,
                profileImg: profileImg,
              },
            });

            console.log("user selectedDegree updated successfully at MongoDB");
            await signOut(auth);
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          try {
            await axios.post("http://localhost:9090/api/users", {
              command: "addUser",
              data: {
                userID: user.uid,
                selectedDegree: selectedDegree.value,
                email: user.email,
                appUsername: appUsername,
                selectedInstitution: selectedInstitution.value,
                intrests: intrests,
                profileImg: profileImg,
              },
            });

            console.log("user registered successfully at MongoDB");

            setIsSaved(true);
            setAppUsername("");
            setProfileImg("");
            setSelectedFile(null);

            setTimeout(() => setIsSaved(false), 3000);
            console.log("Profile saved successfully!");
            await signOut(auth);
            navigateToDashboard("/Dashboard");
          } catch (err) {
            console.log(err);
            navigate(0);
          }
        }
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    } else {
      console.log("Please fill in all the required fields.");
    }
  };

  return { submitHandler };
};

export default useSubmitProfile;
