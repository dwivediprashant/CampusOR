"use client";

import AdminProfileSection from "@/app/components/profile/AdminProfileSection";
import CommonInfoSection from "@/app/components/profile/CommonInfoSection";
import OperatorProfileSection from "@/app/components/profile/OperatorProfileSection";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import ProfileLayout from "@/app/components/profile/ProfileLayout";
import UserProfileSection from "@/app/components/profile/UserProfileSection";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
        </div>
      </ProfileLayout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ProfileLayout>
        <div className="text-center text-slate-600">
          Please log in to view your profile.
        </div>
      </ProfileLayout>
    );
  }

  const profileRole = (role || user.role || "user").toUpperCase();
  const joinedAt = "Not available";

  return (
    <ProfileLayout>
      <ProfileHeader name={user.name || "User"} role={profileRole} />

      <CommonInfoSection
        name={user.name || "User"}
        email={user.email || "Not available"}
        role={profileRole}
        joinedAt={joinedAt}
      />

      {profileRole === "USER" && (
        <UserProfileSection
          collegeEmail={user.email || "Not available"}
          activeToken={undefined}
          recentQueues={[]}
        />
      )}

      {profileRole === "OPERATOR" && (
        <OperatorProfileSection
          department="Not available"
          designation="Not available"
          assignedQueues={[]}
          activeQueue={undefined}
        />
      )}

      {profileRole === "ADMIN" && (
        <AdminProfileSection
          collegeEmail={user.email || "Not available"}
          scope="Not available"
          totalQueuesManaged={0}
        />
      )}
    </ProfileLayout>
  );
}
