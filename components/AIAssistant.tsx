
import React, { useState, useCallback } from 'react';
import { Member, AttendanceRecord, AIAnalysisResult } from '../types';
import { analyzeAttendance } from '../services/geminiService';
import { WandIcon, AlertIcon } from './Icon';

interface AIAssistantProps {
    members: Member[];
    attendanceRecords: AttendanceRecord[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ members, attendanceRecords }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeAttendance(members, attendanceRecords);
            setAnalysis(result);
        } catch (err) {
            setError('Failed to get analysis from AI. Please check your API key and try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [members, attendanceRecords]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-blue/10 p-2 rounded-lg">
                        <WandIcon className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-gray-900">AI-Powered Insights</h2>
                        <p className="text-sm text-brand-gray-500">Identify members who may need a follow-up.</p>
                    </div>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait"
                >
                    {isLoading ? 'Analyzing...' : 'Analyze Attendance'}
                </button>
            </div>
            
            {isLoading && (
                <div className="text-center p-4">
                    <p className="text-brand-gray-600">The AI is analyzing attendance patterns... Please wait.</p>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                        <AlertIcon className="h-5 w-5 text-red-500"/>
                        <div>
                            <p className="font-bold text-red-800">Analysis Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {analysis && analysis.atRiskMembers.length > 0 && (
                 <div className="mt-4 space-y-3">
                    <h3 className="font-semibold text-brand-gray-800">Follow-Up Suggestions:</h3>
                    <ul className="divide-y divide-brand-gray-200">
                        {analysis.atRiskMembers.map((member, index) => (
                            <li key={index} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                               <div>
                                 <p className="font-semibold text-brand-gray-900">{member.name}</p>
                                 <p className="text-sm text-brand-gray-600">{member.suggestion}</p>
                               </div>
                               <button className="flex-shrink-0 bg-brand-gray-100 hover:bg-brand-gray-200 text-brand-gray-700 font-semibold py-1 px-3 rounded-md text-sm transition-colors">
                                Send SMS (Simulated)
                               </button>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}

            {analysis && analysis.atRiskMembers.length === 0 && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-medium">Great news! All primary members have consistent attendance recently.</p>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
