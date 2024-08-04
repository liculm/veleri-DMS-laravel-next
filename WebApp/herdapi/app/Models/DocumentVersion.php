<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentVersion extends BaseModel
{
    use HasFactory;

    protected $table = 'document_version';

    protected $fillable = [
        'document_id',
        'version_number',
        'academic_year',
        'approved_by_user_id',
        'status_id',
        'document_data',
        'modified_by_id',
        'modified_by_name',
    ];

    protected $casts = [
        'document_data' => 'array',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
