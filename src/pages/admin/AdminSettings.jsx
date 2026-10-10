import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import apiClient from '../../services/apiClient'

export default function AdminSettings() {

const user = {
  name: "Admin",
  email: "admin@ventidy.com"
}

const { theme, toggleTheme } = useTheme()

const { register, handleSubmit, formState: { isSubmitting } } = useForm({
  defaultValues: { 
    name: user.name, 
    email: user.email 
  },
})

  const onSubmit = async (values) => {
    try {
      await apiClient.put('/users/me', values)
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900 dark:text-ice">Settings</h2>
        <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Manage your admin profile and preferences.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-7">
        <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Profile</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Name</label>
            <input className="input-field" {...register('name')} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-700 dark:text-white/70">Email</label>
            <input type="email" className="input-field" {...register('email')} />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary !px-6 !py-2.5 text-sm">
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          Save Changes
        </button>
      </form>

      <div className="card flex items-center justify-between p-7">
        <div>
          <h3 className="font-display font-semibold text-navy-900 dark:text-ice">Appearance</h3>
          <p className="mt-1 text-sm text-navy-400 dark:text-white/40">Toggle between light and dark mode.</p>
        </div>
        <button onClick={toggleTheme} className="btn-secondary !px-5 !py-2 text-sm">
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>
    </div>
  )
}
