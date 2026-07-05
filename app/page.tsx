'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoUpload } from '@/components/photo-upload';
import { BirthInfoForm, type BirthInfoFormData } from '@/components/birth-info-form';
import { Heart, Sparkles, Brain, Users, Shield, FileText, Zap, Star, Lock, Eye, CheckCircle2, Image as ImageIconLucide } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [birthInfo, setBirthInfo] = useState<BirthInfoFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate data
    if (!photo) {
      setError('Please upload a photo');
      return;
    }

    if (!birthInfo?.person1BirthDate || !birthInfo?.person2BirthDate) {
      setError('Please enter both birth dates');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build form data
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('person1BirthDate', birthInfo.person1BirthDate);
      formData.append('person2BirthDate', birthInfo.person2BirthDate);

      if (birthInfo.person1Name) {
        formData.append('person1Name', birthInfo.person1Name);
      }
      if (birthInfo.person2Name) {
        formData.append('person2Name', birthInfo.person2Name);
      }

      // Send request
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();

      // Navigate to result page
      const resultData = encodeURIComponent(JSON.stringify(result));
      router.push(`/result/${result.sessionId}?data=${resultData}`);

    } catch (err) {
      console.error('Submission failed:', err);
      setError(err instanceof Error ? err.message : 'Submission failed, please try again');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Split Layout */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">

        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.6}s`,
                opacity: 0.12,
              }}
            >
              <Heart
                className="text-pink-400"
                fill="currentColor"
                size={Math.random() * 25 + 15}
              />
            </div>
          ))}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Column - Content */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              {/* Top Tagline */}
              <div>
                <p className="text-pink-500 font-semibold tracking-[0.3em] text-xs sm:text-sm animate-pulse inline-flex items-center gap-2">
                  <Heart className="inline w-3 h-3" fill="currentColor" />
                  WHERE PHOTOS MEET DESTINY
                  <Heart className="inline w-3 h-3" fill="currentColor" />
                </p>
              </div>

              {/* Main Logo with Heart */}
              <div className="relative">
                {/* Decorative Heart SVG Behind */}
                <svg
                  className="absolute left-1/2 lg:left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-32 -z-10 opacity-10"
                  viewBox="0 0 400 200"
                >
                  <path
                    d="M200,50 C200,20 220,10 240,10 C270,10 280,30 280,50 C280,90 200,140 200,140 C200,140 120,90 120,50 C120,30 130,10 160,10 C180,10 200,20 200,50 Z"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                </svg>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  <span className="text-gray-900">Photo</span>
                  <span className="text-pink-500 relative inline-block">
                    Match
                    <Heart
                      className="absolute -top-4 lg:-top-6 left-1/2 -translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 text-pink-400 animate-pulse"
                      fill="currentColor"
                    />
                  </span>
                  <span className="text-gray-900">Destiny</span>
                </h1>

                {/* Decorative underline */}
                <div className="flex justify-center lg:justify-start mt-4">
                  <svg className="w-48 h-6" viewBox="0 0 200 20">
                    <path
                      d="M10,10 Q100,15 190,10"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="12" r="2.5" fill="#ec4899">
                      <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>

              {/* Taglines */}
              <div className="space-y-3">
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-800">
                  One photo. A million possibilities.
                </p>
                <div className="relative inline-block">
                  <p className="text-lg sm:text-xl lg:text-2xl text-pink-500 font-medium">
                    Find your destiny.
                  </p>
                  {/* Heart curve decoration */}
                  <svg className="hidden lg:block absolute -right-14 top-0 w-14 h-14" viewBox="0 0 50 50">
                    <path
                      d="M10,25 Q25,15 40,25"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M35,20 L40,25 L35,30 M40,25 C42,27 45,27 47,25 C49,23 49,20 47,18 C45,16 42,16 40,18"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    document.getElementById('upload-section')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                  className="group relative inline-flex items-center gap-3 px-8 lg:px-10 py-4 lg:py-5 rounded-full
                           bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600
                           text-white text-lg lg:text-xl font-semibold
                           shadow-2xl shadow-pink-500/50
                           hover:shadow-pink-500/70 hover:scale-105
                           transition-all duration-300
                           animate-gentle-pulse"
                >
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6 animate-heartbeat" fill="currentColor" />
                  <span>Find Your Match</span>
                  <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
                </button>
              </div>

              {/* Bottom Icons */}
              <div className="flex items-center justify-center lg:justify-start gap-8 lg:gap-12 pt-6">
                <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 shadow-md">
                    <svg className="w-6 h-6 lg:w-7 lg:h-7 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700">Upload Photo</span>
                </div>

                <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 shadow-md">
                    <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-pink-500" fill="currentColor" />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700">AI Matching</span>
                </div>

                <div className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-pink-100 flex items-center justify-center border-2 border-pink-200 shadow-md">
                    <Star className="w-6 h-6 lg:w-7 lg:h-7 text-pink-500" fill="currentColor" />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700">Find Destiny</span>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/hero-couple.png"
                  alt="Happy couple in love"
                  width={800}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
                {/* Gradient overlay for extra romance */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Decorative hearts around image */}
              <div className="absolute -top-4 -right-4 animate-bounce">
                <Heart className="w-12 h-12 text-pink-400 opacity-60" fill="currentColor" />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Heart className="w-10 h-10 text-pink-400 opacity-60" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-sm font-medium">Discover More</span>
            <svg className="w-6 h-10" viewBox="0 0 24 40">
              <rect x="8" y="5" width="8" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="currentColor">
                <animate attributeName="cy" values="12;25;12" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Upload Form Section */}
      <div id="upload-section" className="gradient-warm py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Start Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your couple photo and birth dates to receive a comprehensive AI-powered compatibility analysis
            </p>
          </div>

          {/* Analysis Form */}
          <form onSubmit={handleSubmit} className="space-y-8 mb-12">
            <div className="card-airbnb p-8 sm:p-10">
              <PhotoUpload
                onPhotoChange={setPhoto}
                error={!photo && error ? 'Please upload a photo' : ''}
              />
            </div>

            <div className="card-airbnb p-8 sm:p-10">
              <BirthInfoForm onDataChange={setBirthInfo} />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center text-red-600 font-medium">
                {error}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-airbnb-primary min-w-[240px] h-[56px] shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    <span>Start Analysis</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Example Analysis Section */}
      <div className="bg-gradient-to-br from-primary/5 via-white/80 to-primary/10 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here's an example of our AI-powered compatibility analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Example Photo */}
            <div className="card-airbnb overflow-hidden">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/example-couple.png"
                  alt="Example couple photo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Analysis Results Preview */}
            <div className="space-y-6">
              <div className="card-airbnb p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-foreground">Overall Compatibility</h4>
                      <span className="text-2xl font-bold text-primary">87%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-3 mb-3">
                      <div className="bg-gradient-to-r from-primary to-primary/70 h-3 rounded-full" style={{width: '87%'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Exceptional compatibility across appearance, personality, and astrological dimensions
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="card-airbnb p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <h5 className="font-semibold text-foreground">Appearance</h5>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">92</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Visual harmony & attractiveness</p>
                </div>

                <div className="card-airbnb p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h5 className="font-semibold text-foreground">Personality</h5>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">85</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Complementary traits</p>
                </div>

                <div className="card-airbnb p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-primary" fill="currentColor" />
                    <h5 className="font-semibold text-foreground">Intimacy</h5>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">90</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Connection & chemistry</p>
                </div>

                <div className="card-airbnb p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-primary" />
                    <h5 className="font-semibold text-foreground">BaZi Match</h5>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">82</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Astrological harmony</p>
                </div>
              </div>

              <div className="card-airbnb p-5 bg-primary/5 border-primary/20">
                <p className="text-sm text-foreground/80 italic">
                  "Natural smiles, genuine eye contact, and complementary energy - this couple shows strong compatibility across both modern AI analysis and traditional wisdom."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white/60 backdrop-blur-sm py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI combines modern computer vision with ancient wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card-airbnb p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">1. AI Vision Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced AI analyzes facial features, expressions, body language, and intimacy levels in your couple photo
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-airbnb p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">2. BaZi Calculation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chinese astrology system calculates your Four Pillars of Destiny (八字) and analyzes elemental compatibility
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-airbnb p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">3. Comprehensive Report</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive a detailed compatibility report combining AI insights and astrological wisdom
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Features */}
      <div className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              What You'll Get
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive compatibility analysis across multiple dimensions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Photo Analysis */}
            <div className="card-airbnb p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">AI Photo Analysis</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Appearance Matching:</strong> Facial symmetry, visual harmony, and attractiveness scores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Personality Insights:</strong> Inferred traits from facial features, posture, and styling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Intimacy Assessment:</strong> Body language, eye contact, and interaction patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Expression Harmony:</strong> Emotional consistency and genuine connection indicators</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Face Reading */}
            <div className="card-airbnb p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Face Reading (面相学)</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Facial Harmony:</strong> Traditional Chinese physiognomy compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Fortune Signs:</strong> Auspicious features indicating prosperity and happiness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Complementarity:</strong> Balance of yin-yang energies in facial structures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BaZi Astrology */}
            <div className="card-airbnb p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">BaZi Astrology (八字命理)</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Four Pillars:</strong> Year, Month, Day, and Hour pillars with heavenly stems and earthly branches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Five Elements:</strong> Wood, Fire, Earth, Metal, Water balance and interaction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Zodiac Compatibility:</strong> 12 Chinese zodiac animal relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Elemental Synergy:</strong> Supporting vs. conflicting element combinations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PDF Report */}
            <div className="card-airbnb p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Professional PDF Report</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Overall Score:</strong> Comprehensive compatibility rating (0-100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Detailed Analysis:</strong> Multi-page breakdown of all compatibility factors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Visual Charts:</strong> Graphs and diagrams illustrating your compatibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Recommendations:</strong> Personalized relationship advice and insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white/60 backdrop-blur-sm py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We take your privacy seriously
            </p>
          </div>

          <div className="card-airbnb p-10">
            <div className="space-y-6 text-muted-foreground">
              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Storage Policy</h4>
                  <p className="leading-relaxed">
                    Your uploaded photos are processed in real-time and <strong>never stored</strong> on our servers. Once the analysis is complete, all image data is immediately deleted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">One-Time Analysis</h4>
                  <p className="leading-relaxed">
                    Each analysis is performed on-demand. We don't create accounts, track users, or maintain any database of personal information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Secure Processing</h4>
                  <p className="leading-relaxed">
                    All data transmission is encrypted using industry-standard HTTPS protocols. Your photos are processed securely through AI APIs and deleted immediately after analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No Third-Party Sharing</h4>
                  <p className="leading-relaxed">
                    Your images and personal information are never shared with third parties, sold, or used for any purpose other than your requested analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-2xl bg-white/60 backdrop-blur-sm p-8 text-center">
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              <strong className="font-semibold text-foreground">Disclaimer:</strong>
              {' '}This service is provided for entertainment purposes only. The compatibility analysis should not be considered professional advice for relationships, mental health, or life decisions. Results are based on AI interpretation and traditional beliefs, which may not reflect scientific accuracy.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your uploaded photos are used solely for one-time analysis and are not stored or retained.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
