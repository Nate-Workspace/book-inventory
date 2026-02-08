"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { ThemeToggle } from "../components/theme-toggle"
import { Link } from "react-router-dom"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate password reset request
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock validation
      if (!email.includes("@")) {
        setError("Please enter a valid email address.")
        return
      }

      setIsSubmitted(true)
    } catch  {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Berea CMS</h2>
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>

          {/* Success Message */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>We've sent password reset instructions to your email address.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    If an account with email <strong>{email}</strong> exists, you will receive password reset
                    instructions shortly.
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>Didn't receive the email? Check your spam folder or:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Wait a few minutes for the email to arrive</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Contact your system administrator for help</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/login">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Sign In
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Berea Church. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Berea-CMS</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Reset your password to regain access</p>
          <div className="mt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Need Help?</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Contact your church administrator or IT support for assistance with account access.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Berea Church. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
