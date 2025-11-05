"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User as UserIcon, Mail, Shield, Loader2, Save, CheckCircle } from "lucide-react";
import { getCurrentUserProfileAction, updateUserProfileAction } from "@/app/actions/user.actions";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "Admin" | "Moderator" | "Member";
  emailVerified: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUserProfileAction();
      
      if (result.success && result.data) {
        const userData = result.data as unknown as User;
        setUser(userData);
        setFormData({
          name: userData.name || "",
          bio: userData.bio || "",
          avatar: userData.avatar || "",
        });
      } else {
        setError(result.error || "Failed to load profile");
      }
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("bio", formData.bio);
    submitFormData.append("avatar", formData.avatar);

    const result = await updateUserProfileAction(submitFormData);

    if (result.success && result.data) {
      setSuccess(true);
      setUser(result.data as unknown as User);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update profile");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 mt-2">
          View and manage your profile information
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="pt-4 border-t">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </Label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                  {user?.role}
                </span>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {formData.avatar ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={formData.avatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      onError={() => {
                        setFormData({ ...formData, avatar: "" });
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                    {formData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <p className="mt-4 text-sm text-gray-600 text-center">
                  {formData.avatar ? "Custom avatar" : "Default avatar"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
