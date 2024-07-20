<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'document';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
     protected $fillable = [
        'name',
        'description',
        'created_by_id',
        'created_by_name',
        'organizationUnit',
        'documentCode',
        'responsibleStaff',
        'timePeriod',
        'interdependence'
    ];

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class);
    }
}
