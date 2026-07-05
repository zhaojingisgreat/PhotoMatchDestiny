'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoUpload } from '@/components/photo-upload';
import { BirthInfoForm, type BirthInfoFormData } from '@/components/birth-info-form';
import { Heart, Sparkles, Brain, Users, Shield, FileText, Zap, Star, Lock, Eye, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen gradient-warm">
      {/* Hero Section */}
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="mb-12 sm:mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-pulse" fill="currentColor" />
            <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
              PhotoMatch<span className="text-primary">Destiny</span>
            </h1>
            <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <p className="text-lg sm:text-xl text-foreground/70 px-4 font-normal leading-relaxed max-w-2xl mx-auto">
            AI-powered couple compatibility analysis combining computer vision and Chinese astrology
          </p>
          <p className="mt-4 text-base text-muted-foreground px-4">
            Upload your couple photo and birth dates to get a comprehensive compatibility report
          </p>
        </div>

        {/* Analysis Form */}
        <form onSubmit={handleSubmit} className="space-y-8 mb-20">
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
