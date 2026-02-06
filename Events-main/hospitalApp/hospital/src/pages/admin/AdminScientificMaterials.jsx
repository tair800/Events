import React, { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import './AdminScientificMaterials.css'

function AdminScientificMaterials() {
    const [materials, setMaterials] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingMaterial, setEditingMaterial] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        link: ''
    })

    useEffect(() => {
        fetchMaterials()
    }, [])

    const fetchMaterials = async () => {
        try {
            setLoading(true)
            const response = await fetch('https://localhost:5000/api/scientificmaterials')
            if (!response.ok) {
                throw new Error('Failed to fetch materials')
            }
            const data = await response.json()
            setMaterials(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Error fetching materials:', err)
            setError(err.message || 'Failed to load materials')
        } finally {
            setLoading(false)
        }
    }

    const filteredMaterials = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return materials
        return materials.filter((material) => {
            const haystack = [
                material.name,
                material.link,
                new Date(material.createdAt).toLocaleDateString()
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
            return haystack.includes(query)
        })
    }, [materials, search])

    const handleAdd = () => {
        setFormData({ name: '', link: '' })
        setEditingMaterial(null)
        setShowAddModal(true)
    }

    const handleEdit = (material) => {
        setFormData({
            name: material.name,
            link: material.link
        })
        setEditingMaterial(material)
        setShowAddModal(true)
    }

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://localhost:5000/api/scientificmaterials/${id}`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    Swal.fire('Deleted!', 'Material has been deleted.', 'success')
                    fetchMaterials()
                } else {
                    Swal.fire('Error!', 'Failed to delete material.', 'error')
                }
            } catch (err) {
                console.error('Error deleting material:', err)
                Swal.fire('Error!', 'An error occurred while deleting.', 'error')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = editingMaterial
                ? `https://localhost:5000/api/scientificmaterials/${editingMaterial.id}`
                : 'https://localhost:5000/api/scientificmaterials'
            
            const method = editingMaterial ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    link: formData.link
                })
            })

            if (response.ok) {
                Swal.fire(
                    'Success!',
                    editingMaterial ? 'Material updated successfully.' : 'Material added successfully.',
                    'success'
                )
                setShowAddModal(false)
                setFormData({ name: '', link: '' })
                setEditingMaterial(null)
                fetchMaterials()
            } else {
                Swal.fire('Error!', 'Failed to save material.', 'error')
            }
        } catch (err) {
            console.error('Error saving material:', err)
            Swal.fire('Error!', 'An error occurred while saving.', 'error')
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '—'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <div className="admin-scientific-materials-page">
            <div className="admin-scientific-materials-container">
                <div className="admin-scientific-materials-header">
                    <h1>Elmi Materiallar</h1>
                    <div className="admin-scientific-materials-header-actions">
                        <div className="admin-scientific-materials-search-container">
                            <input
                                type="text"
                                className="admin-scientific-materials-search-input"
                                placeholder="Search materials..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="admin-scientific-materials-add-btn" onClick={handleAdd}>
                            + Add Material
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-scientific-materials-loading">Loading...</div>
                ) : error ? (
                    <div className="admin-scientific-materials-error">{error}</div>
                ) : filteredMaterials.length === 0 ? (
                    <div className="admin-scientific-materials-empty">No materials found</div>
                ) : (
                    <div className="admin-scientific-materials-table">
                        <div className="admin-scientific-materials-row header">
                            <span>Name</span>
                            <span>Link</span>
                            <span>Date</span>
                            <span>Actions</span>
                        </div>
                        {filteredMaterials.map((material) => (
                            <div key={material.id} className="admin-scientific-materials-row">
                                <span>{material.name}</span>
                                <span className="material-link">
                                    <a href={material.link} target="_blank" rel="noopener noreferrer">
                                        {material.link.length > 50 ? material.link.substring(0, 50) + '...' : material.link}
                                    </a>
                                </span>
                                <span>{formatDate(material.createdAt)}</span>
                                <span className="material-actions">
                                    <button className="material-edit-btn" onClick={() => handleEdit(material)}>
                                        Edit
                                    </button>
                                    <button className="material-delete-btn" onClick={() => handleDelete(material.id)}>
                                        Delete
                                    </button>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="admin-scientific-materials-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="admin-scientific-materials-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-scientific-materials-modal-header">
                            <h2>{editingMaterial ? 'Edit Material' : 'Add Material'}</h2>
                            <button className="admin-scientific-materials-modal-close" onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        <form className="admin-scientific-materials-form" onSubmit={handleSubmit}>
                            <div className="admin-scientific-materials-form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-scientific-materials-form-group">
                                <label>Link</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="admin-scientific-materials-form-actions">
                                <button type="button" className="admin-scientific-materials-cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-scientific-materials-submit-btn">
                                    {editingMaterial ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminScientificMaterials

