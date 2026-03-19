import React, { useCallback, useEffect, useState } from 'react';
import { Edit, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingScreen from '../ui/LoadingScreen';
import { useFetchProfile, useUpdateProfile, type UpdateProfilePayload } from '../../hook/useProfile';
import { OnboardingCard } from '../onboardcards/OnboardingCards';
import { useAppDispatch, useAppSelector } from '../../lib/store/store';
import { setBackgroundProfile } from '../../lib/store/features/globle';
import { useNavigate } from 'react-router-dom';

const ProfileSettingForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);
  const { background } = useAppSelector(s => s.global)
  const { fetchProfile, error, loading, data: user } = useFetchProfile()
  const { updateProfile, loading: update_loading } = useUpdateProfile()
  const [showCard, handleShowCard] = useState<boolean>(false)


  const onclickOut = useCallback(() => {
    handleShowCard(false)
    dispatch(setBackgroundProfile(false))
  }, [dispatch])

  // useEffect(() => {
  //   if (localStorage.getItem("ProfileTutorial")) {
  //     onclickOut()
  //   }
  // }, [onclickOut, isEditing])

  useEffect(() => {
    if (loading) {
      handleShowCard(false)
      dispatch(setBackgroundProfile(false))
      return
    }
    // if address present showing the card
    else if (!user?.address) {
      if (localStorage.getItem("ProfileTutorial")) {
        onclickOut()
        return
      }
      handleShowCard(true)
      dispatch(setBackgroundProfile(true))
      return
    }
    handleShowCard(false)
    dispatch(setBackgroundProfile(false))

  }, [user, dispatch, loading, onclickOut])

  //document.addEventListener("click", onclickOut)

  const [formData, setFormData] = useState<UpdateProfilePayload>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? ""
  });

  const handleEdit = () => {
    setIsEditing(true);
    onclickOut()
  };

  const handleSave = () => {
    setIsEditing(false);
    updateProfile(formData).then((data) => {
      //->console.log("update the profile", data)
      setFormData(data as UpdateProfilePayload)
      toast.success("Profile Updated Successfully")
      navigate("/dashboard/")

    }).catch((err) => {
      toast.success("Profile Updated Failed")
      console.log(err)
    }).finally(() => dispatch(setBackgroundProfile(false)))
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (user) {
      setFormData(user)
    } else {
      fetchProfile()
    }
  }, [fetchProfile, error, user])

  return (
    <div className="min-h-screen mt-4 px-0 relative">
      {update_loading && <LoadingScreen title={"Updating"} />}
      {loading && <LoadingScreen title={"Profile"} />}
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8">
          <div className="flex items-center justify-between mb-8">
            {showCard &&
              <OnboardingCard
                icon={MapPin}
                title='Enter Your Address'
                description='Please enter your address to generate the Acceptance and Copyright Forms.'
                iconBg='bg-teal-100'
                BgColor='bg-white'
                iconColor='text-red-500'
                dotColors={['bg-amber-700', 'bg-orange-300', 'bg-teal-300']}
                showTags={false}
                nextTag={false}
                position='-right-30 top-10 sm:-right-10 sm:top-20'
                hideHandler={handleShowCard}
                skip={false} // skip button will be shown for dashboard section its the key that disable all the tour for whole app
              />}
            <h2 className="text-2xl font-semibold text-gray-900">Profile Setting</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className={`p-2 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors ${background ? "relative z-9999 bg-white scale-125" : ""}`}
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name, Email, Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--journal-500) ${!isEditing ? 'bg-gray-50' : 'bg-white'
                    }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly={true}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--journal-500) bg-gray-50`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile No
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={true}
                  className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--journal-500) bg-gray-50`}
                />
              </div>
            </div>

            {/* Address Row */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                required
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--journal-500) resize-none ${!isEditing ? 'bg-gray-50' : 'bg-white'
                  }`}
              />
            </div>

            {/* Save Button */}

            {isEditing && <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-(--journal-600) text-white rounded-lg hover:bg-(--journal-700) transition-colors font-medium"
              >
                Save
              </button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingForm;