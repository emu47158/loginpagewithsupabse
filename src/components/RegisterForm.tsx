import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Github, Chrome, AtSign, Hash, CheckCircle, AlertCircle } from 'lucide-react'
import FormInput from './FormInput'
import SocialButton from './SocialButton'
import { useAuth } from '../contexts/AuthContext'

interface RegisterFormProps {
  onRegisterSuccess: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp, signInWithGoogle, signInWithGitHub } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    setIsLoading(true)
    
    // Sign up with Supabase
    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.name,
      nickname: formData.nickname,
      username: formData.username,
    })
    
    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      setShowSuccess(true)
      
      // Show success message briefly then redirect to login
      setTimeout(() => {
        onRegisterSuccess()
      }, 1500)
    }
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
  }

  const handleGitHubSignUp = async () => {
    setError(null)
    const { error } = await signInWithGitHub()
    if (error) {
      setError(error.message)
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Account Created Successfully!</h3>
        <p className="text-white/70">Please check your email to confirm your account.</p>
        <p className="text-white/50 text-sm mt-2">Redirecting to login page...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <FormInput
        type="text"
        name="name"
        placeholder="Full name"
        value={formData.name}
        onChange={handleChange}
        icon={<User className="w-5 h-5" />}
        required
      />

      <FormInput
        type="text"
        name="nickname"
        placeholder="Nickname"
        value={formData.nickname}
        onChange={handleChange}
        icon={<Hash className="w-5 h-5" />}
        required
      />

      <FormInput
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        icon={<AtSign className="w-5 h-5" />}
        required
      />

      <FormInput
        type="email"
        name="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        icon={<Mail className="w-5 h-5" />}
        required
      />

      <FormInput
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder="Password (min. 6 characters)"
        value={formData.password}
        onChange={handleChange}
        icon={<Lock className="w-5 h-5" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        required
      />

      <FormInput
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirmPassword"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
        icon={<Lock className="w-5 h-5" />}
        endIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
        required
      />

      <label className="flex items-start space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
          required
        />
        <span className="text-white/70 text-sm">
          I agree to the{' '}
          <a href="#" className="text-white hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-white hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading || !agreedToTerms}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            <span>Create Account</span>
          </>
        )}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/50">Or sign up with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton 
          icon={<Chrome className="w-5 h-5" />} 
          label="Google"
          onClick={handleGoogleSignUp}
        />
        <SocialButton 
          icon={<Github className="w-5 h-5" />} 
          label="GitHub"
          onClick={handleGitHubSignUp}
        />
      </div>
    </form>
  )
}

export default RegisterForm
