
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, Plus, X, Loader2, Search, Filter, Globe, Lock, Share2, 
  Trash2, ExternalLink, Heart, Bookmark, PlayCircle, Film
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface SharedMedia {
  id: string;
  title: string;
  url: string;
  mediaType: 'image' | 'video';
  authorId: string;
  authorName: string;
  timestamp: any;
  description?: string;
  tags?: string[];
}

interface CommunityLibraryProps {
  onClose: () => void;
  onPinMedia?: (media: any) => void;
}

export const CommunityLibrary: React.FC<CommunityLibraryProps> = ({ onClose, onPinMedia }) => {
  const [mediaItems, setMediaItems] = useState<SharedMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  
  // Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newDesc, setNewDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'community_media'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SharedMedia[];
      setMediaItems(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'community_media');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Neural Link Required: Please sign in to share media.");
      return;
    }

    if (!newTitle || !newUrl) {
      toast.error("Incomplete Data: Title and URL are mandatory.");
      return;
    }

    setIsUploading(true);
    try {
      await addDoc(collection(db, 'community_media'), {
        title: newTitle,
        url: newUrl,
        mediaType: newType,
        description: newDesc,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous Sonographer',
        timestamp: Date.now(), // rules check for number or serverTimestamp? rules said number in blueprint but rule is checking is number.
        // Actually firestore.rules used `data.timestamp is number` in my previous edit.
      });
      toast.success("Media Synthesized: Content shared with the community.");
      setShowUpload(false);
      setNewTitle('');
      setNewUrl('');
      setNewDesc('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'community_media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, authorId: string) => {
    if (auth.currentUser?.uid !== authorId) return;
    
    if (window.confirm("Purge Media? This action is irreversible.")) {
      try {
        await deleteDoc(doc(db, 'community_media', id));
        toast.success("Media Expunged from Global Archives.");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `community_media/${id}`);
      }
    }
  };

  const filteredMedia = mediaItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-7xl bg-[#0a0502] rounded-[3rem] border border-white/10 shadow-4xl overflow-hidden flex flex-col h-full md:max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
               <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                 <Globe size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Connectivity</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
               The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">Library</span>
            </h2>
            <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Shared reference media for the sonography community.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search Archives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowUpload(!showUpload)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all font-black uppercase text-[10px] tracking-widest shadow-xl ${showUpload ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white hover:scale-105 active:scale-95'}`}
            >
              {showUpload ? <X size={16} /> : <Plus size={16} />}
              <span>{showUpload ? 'Cancel' : 'Share Media'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 transition-all border border-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
                <Loader2 size={48} className="animate-spin text-indigo-500" />
                <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Global Node...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-8">
                <ImageIcon size={64} className="text-slate-700" />
                <div className="text-center space-y-2">
                   <h3 className="text-2xl font-black uppercase italic">Archives Silent</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest">No matching media found in global storage.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredMedia.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative"
                    >
                      <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-6 hover:bg-white/[0.07] transition-all hover:scale-[1.02] cursor-pointer overflow-hidden border-b-4 border-indigo-500/20">
                         {/* Preview */}
                         <div className="aspect-video rounded-2xl bg-slate-900 relative overflow-hidden group/img">
                           {item.mediaType === 'video' ? (
                             <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900/10 text-indigo-400">
                                <Film size={48} />
                                <PlayCircle className="absolute inset-0 m-auto text-white/50 group-hover/img:scale-125 transition-transform" size={64} />
                             </div>
                           ) : (
                             <img 
                               src={item.url} 
                               alt={item.title} 
                               className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000 grayscale group-hover/img:grayscale-0"
                               referrerPolicy="no-referrer"
                             />
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                           <div className="absolute bottom-4 left-4 flex items-center gap-2">
                             <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/10">
                               {item.mediaType}
                             </div>
                           </div>
                         </div>

                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <h3 className="text-xl font-black tracking-tight uppercase italic text-white group-hover:text-indigo-400 transition-colors truncate">
                                {item.title}
                              </h3>
                              {auth.currentUser?.uid === item.authorId && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.authorId); }}
                                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                           </div>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest line-clamp-2 leading-relaxed">
                             {item.description || 'No description provided.'}
                           </p>
                         </div>

                         <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                               {item.authorName.charAt(0).toUpperCase()}
                             </div>
                             <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{item.authorName}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); onPinMedia?.(item); }}
                                className="p-3 bg-white/5 rounded-full hover:bg-white text-slate-400 hover:text-black transition-all"
                                title="Add to Vault"
                              >
                                <Bookmark size={16} />
                              </button>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-3 bg-white/5 rounded-full hover:bg-white text-slate-400 hover:text-black transition-all"
                              >
                                <ExternalLink size={16} />
                              </a>
                           </div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Side: Upload Panel */}
          <AnimatePresence>
            {showUpload && (
              <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                className="w-full md:w-96 bg-white/[0.02] border-l border-white/5 p-8 md:p-12 space-y-10"
              >
                <div className="space-y-2">
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic">Share Resource</h3>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contribute to the global sonography index.</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reference Title</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Mirror Image Artifact"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resource URL</label>
                    <input 
                      type="url" 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://imgur.com/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Media Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setNewType('image')}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'image' ? 'bg-indigo-600 border-transparent text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                      >
                        Image
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewType('video')}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${newType === 'video' ? 'bg-indigo-600 border-transparent text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                      >
                        Video
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Intelligence Insight</label>
                    <textarea 
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Explain the clinical significance..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                    />
                  </div>

                  <button 
                    disabled={isUploading}
                    className="w-full py-6 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} className="group-hover:rotate-12" />}
                    <span>{isUploading ? 'Synthesizing...' : 'Commit to Global Index'}</span>
                  </button>
                </form>

                <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                   <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-relaxed">
                     "Shared media undergoes rapid logic verification. Ensure all resources follow clinical guidelines."
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
