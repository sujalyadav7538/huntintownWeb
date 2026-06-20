import { useEffect, useMemo, useState } from "react";

import { User } from "../types";

import { useAppSelector } from "../store/hooks";

import ProfileCompletion from "./profile/ProfileCompletion";
import ProfilePreviewCard from "./profile/ProfilePreviewCard";
import ProfileEditForm from "./profile/ProfileEditForm";

interface ProfileViewProps {
  onUpdateProfile: (updated: User) => void;
}

export default function ProfileView({ onUpdateProfile }: ProfileViewProps) {
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio || "");

  const [skillsString, setSkillsString] = useState(
    currentUser.skills?.join(", ") || "",
  );

  const [avatar, setAvatar] = useState(currentUser.avatar);

  const [isSaving, setIsSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const previewUser: User = useMemo(() => {
    return {
      ...currentUser,
      name,
      role,
      location,
      bio,
      avatar,
      skills: skillsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }, [currentUser, name, role, location, bio, avatar, skillsString]);

  const hasUnsavedChanges =
    JSON.stringify(previewUser) !== JSON.stringify(currentUser);

  const completionPercentage = useMemo(() => {
    const checks = [
      previewUser.name,
      previewUser.role,
      previewUser.location,
      previewUser.bio,
      previewUser.avatar,
      previewUser.skills?.length,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [previewUser]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("access_token");
      const data = await fetch("/api/profile/update", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(previewUser),
      });

      if (!data.ok) {
        throw new Error("Failed to update profile");
      }

      onUpdateProfile(previewUser);

      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setName(currentUser.name);
    setRole(currentUser.role);
    setLocation(currentUser.location);
    setBio(currentUser.bio || "");
    setAvatar(currentUser.avatar);

    setSkillsString(currentUser.skills?.join(", ") || "");
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        {isEditing ? (
          <>
            <ProfileCompletion percentage={completionPercentage} />

            <div className="lg:col-span-8">
              <ProfileEditForm
                user={previewUser}
                name={name}
                setName={setName}
                role={role}
                setRole={setRole}
                location={location}
                setLocation={setLocation}
                bio={bio}
                setBio={setBio}
                skillsString={skillsString}
                setSkillsString={setSkillsString}
                setAvatar={setAvatar}
                avatar={avatar}
                handleSave={handleSave}
                handleDiscard={handleDiscard}
              />
            </div>
          </>
        ) : (
          <ProfilePreviewCard user={previewUser} />
        )}
      </div>
    </>
  );
}
