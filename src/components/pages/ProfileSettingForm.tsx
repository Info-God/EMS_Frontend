import React, { useCallback, useEffect, useState } from 'react';
import { Edit, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingScreen from '../ui/LoadingScreen';
import { useFetchProfile, useUpdateProfile, type UpdateProfilePayload } from '../../hook/useProfile';
import { OnboardingCard } from '../onboardcards/OnboardingCards';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { setBackgroundProfile } from '../../lib/store/features/globle';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type ProfileFormData = {
  name: string;
  email: string;
  address: string;
};

// Parse stored "+91 9876543210" or "919876543210" → { dialCode: "91", local: "9876543210" }
// If phone is empty or missing, returns empty strings so inputs render blank
const parseStoredPhone = (stored: string): { dialCode: string; local: string } => {
  const raw = stored.replace(/\D/g, '');
  // console.log(raw)
  if (!raw) return { dialCode: "", local: "" };
  if (raw.length <= 10) return { dialCode: "", local: raw };
  const response = {
    dialCode: raw.slice(0, raw.length - 10),
    local: raw.slice(-10),
  }
  return response;
};

const ProfileSettingForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { background } = useAppSelector(s => s.global);
  const { fetchProfile, error, loading, data: user } = useFetchProfile();
  const { updateProfile, loading: update_loading } = useUpdateProfile();
  const [showCard, handleShowCard] = useState<boolean>(false);

  // dialCode = digits only e.g. "91" — empty string means no phone on record
  // localPhone = 10-digit local number — empty string means no phone on record
  const [dialCode, setDialCode] = useState("");
  const [localPhone, setLocalPhone] = useState("");

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    address: "",
  });


  const onclickOut = useCallback(() => {
    handleShowCard(false);
    localStorage.setItem("ProfileTutorial", "true");
    dispatch(setBackgroundProfile(false));
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem("ProfileTutorial")) {
      onclickOut();
    }
  }, [onclickOut, isEditing]);

  useEffect(() => {
    if (loading) {
      handleShowCard(false);
      dispatch(setBackgroundProfile(false));
      return;
    }
    if (!user?.address) {
      if (localStorage.getItem("ProfileTutorial")) {
        onclickOut();
        return;
      }
      handleShowCard(true);
      dispatch(setBackgroundProfile(true));
      return;
    }
    handleShowCard(false);
    dispatch(setBackgroundProfile(false));
  }, [user, dispatch, loading, onclickOut]);

  document.addEventListener("click", onclickOut);


  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (user) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        address: user.address ?? "",
      });
      // If phone is absent or empty → both fields stay blank (user must fill on save)
      const parsed = parseStoredPhone(user.phone ?? "");
      setDialCode(parsed.dialCode);
      setLocalPhone(parsed.local);
    } else {
      fetchProfile();
    }
  }, [fetchProfile, error, user]);


  const handleEdit = () => {
    setIsEditing(true);
    onclickOut();
  };

  // PhoneInput used ONLY as country code selector — number input is separate
  const handlePrefixChange = (_: string, data: CountryData) => {
    const code = 'dialCode' in data ? (data as CountryData).dialCode : dialCode;
    setDialCode(code);
  };

  const handleLocalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setLocalPhone(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // If user has started entering a phone, both country code and number must be complete
    if (localPhone || dialCode) {
      if (!dialCode) {
        toast.error("Please select a country code");
        return;
      }
      if (!localPhone) {
        toast.error("Please enter your mobile number");
        return;
      }
      if (localPhone.length !== 10) {
        toast.error("Enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsEditing(false);

    const payload: UpdateProfilePayload = {
      name: formData.name,
      email: formData.email,
      // "+91 9876543210" if provided, empty string if not
      phone: dialCode && localPhone ? `+${dialCode} ${localPhone}` : "",
      address: formData.address,
    };

    updateProfile(payload)
      .then((data) => {
        const updatedData = data as UpdateProfilePayload | null;
        if (updatedData) {
          setFormData({
            name: updatedData.name ?? "",
            email: updatedData.email ?? "",
            address: updatedData.address ?? "",
          });
          const parsed = parseStoredPhone(updatedData.phone ?? "");
          setDialCode(parsed.dialCode);
          setLocalPhone(parsed.local);
        }
        toast.success("Profile Updated Successfully");
        navigate("/dashboard/");
      })
      .catch((err) => {
        toast.error("Profile Update Failed");
        console.log(err);
      })
      .finally(() => dispatch(setBackgroundProfile(false)));
  };

  /* ─── render ─────────────────────────────────────────────────── */

  const inputBase = `w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700
    focus:outline-none focus:ring-2 focus:ring-(--journal-500)`;

  return (
    <div className="min-h-screen mt-4 px-0 relative">
      {update_loading && <LoadingScreen title={"Updating"} />}
      {loading && <LoadingScreen title={"Profile"} />}

      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            {showCard && (
              <OnboardingCard
                icon={MapPin}
                title="Enter Your Address"
                description="Please enter your address to generate the Acceptance and Copyright Forms."
                iconBg="bg-teal-100"
                BgColor="bg-white"
                iconColor="text-red-500"
                dotColors={['bg-amber-700', 'bg-orange-300', 'bg-teal-300']}
                showTags={false}
                nextTag={false}
                position="-right-30 top-10 sm:-right-10 sm:top-20"
                hideHandler={onclickOut}
                skip={false}
              />
            )}
            <h2 className="text-2xl font-semibold text-gray-900">Profile Setting</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className={`p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400
                  hover:bg-gray-50 transition-colors ${
                  background ? "relative z-9999 bg-white scale-125" : ""
                }`}
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`${inputBase} ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly={true}
                  className={`${inputBase} bg-gray-50`}
                />
              </div>

              {/* Mobile — flag/code picker (left) + number input (right) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
                <div className="flex items-center gap-2">

                  {/* Country code selector — typing disabled, flag dropdown only */}
                  <PhoneInput
                    // country={dialCode ? undefined : "in"}
                    value={dialCode}
                    onChange={handlePrefixChange}
                    disabled={!isEditing}
                    inputClass="!w-[90px] !h-[50px]"
                    buttonClass={`!h-[50px] ${!isEditing ? '!bg-gray-50' : '!bg-white'}`}
                    containerClass="!w-[90px] flex-shrink-0"
                    inputProps={{
                      readOnly: true,   // block typing — flag dropdown changes code only
                      tabIndex: -1,     // skip in tab order
                    }}
                  />

                  {/* Local 10-digit number */}
                  <input
                    type="tel"
                    name="phone"
                    value={localPhone}
                    onChange={handleLocalPhoneChange}
                    readOnly={!isEditing}
                    maxLength={10}
                    placeholder={!isEditing && !localPhone ? "—" : "Enter Mobile No"}
                    className={`${inputBase} flex-1 !py-0 h-[50px] ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                  />

                </div>
              </div>

            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                required
                rows={3}
                className={`${inputBase} resize-none ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
              />
            </div>

            {/* Save */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-(--journal-600) text-white rounded-lg
                    hover:bg-(--journal-700) transition-colors font-medium"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingForm;