import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Button } from './ui/Button';
import { X, Upload, Check } from 'lucide-react';
import { Kit } from '../types';

interface AddKitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddKitModal: React.FC<AddKitModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        marketing_description: '',
        deal_code: '',
        rental_price: '',
        rental_term: '',
    });

    const [images, setImages] = useState<{
        hero: File | null;
        detail1: File | null;
        detail2: File | null;
    }>({ hero: null, detail1: null, detail2: null });

    if (!isOpen) return null;

    const handleImageChange = (type: 'hero' | 'detail1' | 'detail2', file: File | null) => {
        setImages(prev => ({ ...prev, [type]: file }));
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('kit-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('kit-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images
            let heroUrl = '', detail1Url = '', detail2Url = '';

            if (images.hero) heroUrl = await uploadImage(images.hero);
            if (images.detail1) detail1Url = await uploadImage(images.detail1);
            if (images.detail2) detail2Url = await uploadImage(images.detail2);

            // 2. Insert Record
            const { error } = await supabase.from('kits').insert({
                name: formData.name,
                description: formData.description,
                marketing_description: formData.marketing_description,
                deal_code: formData.deal_code,
                rental_price: parseFloat(formData.rental_price),
                rental_term: formData.rental_term,
                hero_image_url: heroUrl,
                detail1_image_url: detail1Url,
                detail2_image_url: detail2Url,
                status: 'active'
            });

            if (error) throw error;

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error adding kit:', err);
            alert('Failed to add kit: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
                    <h2 className="text-xl font-bold text-white">Add New Inventory Kit</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Kit Name</label>
                            <input
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. MacBook Pro Workstation"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Deal Code</label>
                            <input
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                                value={formData.deal_code}
                                onChange={e => setFormData({ ...formData, deal_code: e.target.value })}
                                placeholder="e.g. DEAL-2024-001"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Rental Price (ZAR)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                                value={formData.rental_price}
                                onChange={e => setFormData({ ...formData, rental_price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Rental Term</label>
                            <input
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                                value={formData.rental_term}
                                onChange={e => setFormData({ ...formData, rental_term: e.target.value })}
                                placeholder="e.g. 24 Months"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Short Description</label>
                        <textarea
                            required
                            rows={2}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief overview used in cards..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Marketing Description</label>
                        <textarea
                            rows={3}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-zinc-600"
                            value={formData.marketing_description}
                            onChange={e => setFormData({ ...formData, marketing_description: e.target.value })}
                            placeholder="Detailed selling points..."
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-zinc-300 border-b border-zinc-800 pb-2">Kit Images</h3>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Hero Image', key: 'hero' as const },
                                { label: 'Detail 1', key: 'detail1' as const },
                                { label: 'Detail 2', key: 'detail2' as const },
                            ].map((slot) => (
                                <div key={slot.key} className="relative group">
                                    <label className="block text-xs text-zinc-500 mb-1">{slot.label}</label>
                                    <div className="aspect-square bg-zinc-950 border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all overflow-hidden relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(slot.key, e.target.files?.[0] || null)}
                                        />

                                        {images[slot.key] ? (
                                            <>
                                                <img
                                                    src={URL.createObjectURL(images[slot.key]!)}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-xs text-white">Change</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-2">
                                                <Upload size={20} className="mx-auto text-zinc-500 mb-1" />
                                                <span className="text-xs text-zinc-600">Upload</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-500">
                            * Hero image is required. Supported formats: JPG, PNG, WEBP.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading}>
                            Create Kit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
